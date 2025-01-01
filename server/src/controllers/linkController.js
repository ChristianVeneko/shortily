import { supabase } from "../services/supabaseService.js";
import { v4 as uuidv4 } from "uuid";

export const status = async (req, res) => {
  res.status(200).json({ success: true, message: "API is running" });
}

export const mantainDatabase = async (req, res) => {
  try {
    const { data, error } = await supabase
      .from("test")
      .select("texto")

    if (error) {
      console.error("Error fetching data: ", error)
      return res.status(500).json({ success: false, message: "Error fetching data", error: error.message })
    }

    if (!data || data.length === 0) { 
      console.log("No data found in table 'test'")
      return res.status(200).json({ success: true, message: "No data found", data: [] });
    }

    return res.status(200).json({ success: true, data })

  } catch (error) {
    console.error("Unexpected error: ", error)
    return res.status(500).json({ success: false, message: "Unexpected error", error: error.message }) 
  }
}

export const createLink = async (req, res) => {
  const { original_url } = req.body;
  const user_id = req.user.id;
  const short_url = uuidv4().slice(0, 6);

  try {
    const { data, error } = await supabase
      .from("links")
      .insert([{ user_id, original_url, short_url }])
      .select();
    if (error) throw error;
    const urls = data[0];
    res.status(201).json({ success: true, urls });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const getLinks = async (req, res) => {
  const user_id = req.user.id;

  try {
    const { data, error } = await supabase
      .from("links")
      .select("*")
      .eq("user_id", user_id);
    if (error) throw error;
    res.status(200).json({ success: true, data });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const getLinkByShortUrl = async (req, res) => {
  const shortUrl = req.params.shortUrl;
  try {
    const { data, error } = await supabase
      .from("links")
      .select("*")
      .eq("short_url", shortUrl);
    if (error) throw error;

    if (data.length === 0) {
      return res
        .status(404)
        .json({ success: false, message: "Link not found" });
    }

    // Devolver el enlace original como respuesta
    res.status(200).json({ success: true, data: data[0] });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const updateLink = async (req, res) => {
  const { id, original_url } = req.body;

  try {
    const { data, error } = await supabase
      .from("links")
      .update({ original_url })
      .eq("id", id)
      .select();
    if (error) throw error;
    res.status(200).json({ success: true, data: data[0] });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const deleteLink = async (req, res) => {
  const { id } = req.body;

  try {
    const { data, error } = await supabase
      .from("links")
      .delete()
      .eq("id", id)
      .select();
    if (error) throw error;
    res.status(200).json({ success: true, data: data[0] });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
