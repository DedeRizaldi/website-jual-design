/**
 * BACKEND IMPLEMENTATION REFERENCE
 * 
 * This file contains the server code for Node.js + Express.
 * To run this:
 * 1. Create a package.json in this folder
 * 2. npm install express cors dotenv @supabase/supabase-js multer
 * 3. npx ts-node server/index.ts
 */

import express, { Request, Response, NextFunction } from 'express';
import cors from 'cors';
import * as dotenv from 'dotenv';
import multer from 'multer';
import { createClient } from '@supabase/supabase-js';

// Configuration
dotenv.config();
const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// Supabase Client
const supabaseUrl = process.env.SUPABASE_URL || '';
const supabaseKey = process.env.SUPABASE_ANON_KEY || '';
const supabase = createClient(supabaseUrl, supabaseKey);

// Multer Config for Memory Storage (files < 300KB)
const upload = multer({
  storage: multer.memoryStorage(),
  limits: {
    fileSize: 300 * 1024, // 300KB limit
  },
  fileFilter: (req, file, cb) => {
    if (file.mimetype.startsWith('image/')) {
      cb(null, true);
    } else {
      cb(null, false);
    }
  }
});

// --- ROUTES ---

// 1. Get Categories
app.get('/api/categories', async (req: Request, res: Response) => {
  const { data, error } = await supabase.from('categories').select('*');
  if (error) return res.status(500).json({ error: error.message });
  res.json(data);
});

// 2. Get Products
app.get('/api/products', async (req: Request, res: Response) => {
  const { category } = req.query;
  let query = supabase.from('products').select('*');

  if (category) {
    // Need to join or filter by category_id normally, simulating simple filter here
    // assuming category param matches
  }

  const { data, error } = await query;
  if (error) return res.status(500).json({ error: error.message });
  res.json(data);
});

// 3. Get Single Product
app.get('/api/products/:id', async (req: Request, res: Response) => {
  const { data, error } = await supabase
    .from('products')
    .select('*')
    .eq('id', req.params.id)
    .single();

  if (error) return res.status(404).json({ error: 'Product not found' });
  res.json(data);
});

// 4. Create Product (Admin - with Image Upload)
app.post('/api/products', upload.single('image'), async (req: Request, res: Response): Promise<void> => {
  try {
    const { title, description, price, category_id } = req.body;
    const file = req.file;

    if (!file) {
      res.status(400).json({ error: 'Image is required' });
      return;
    }

    // Upload to Supabase Storage
    const fileName = `${Date.now()}-${file.originalname}`;
    const { data: uploadData, error: uploadError } = await supabase.storage
      .from('product-images')
      .upload(fileName, file.buffer, {
        contentType: file.mimetype,
      });

    if (uploadError) throw uploadError;

    // Get Public URL
    const { data: { publicUrl } } = supabase.storage
      .from('product-images')
      .getPublicUrl(fileName);

    // Insert into Database
    const { data, error } = await supabase
      .from('products')
      .insert([
        {
          title,
          description,
          price: parseFloat(price),
          category_id, // ensure this UUID exists in categories table
          image_url: publicUrl,
          file_url: 'https://dummy-link.com/download.zip' // Dummy for now
        }
      ])
      .select();

    if (error) throw error;

    res.status(201).json(data[0]);

  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

// 5. Delete Product
app.delete('/api/products/:id', async (req: Request, res: Response) => {
  const { error } = await supabase.from('products').delete().eq('id', req.params.id);
  if (error) return res.status(500).json({ error: error.message });
  res.json({ message: 'Deleted successfully' });
});

// Start Server
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});