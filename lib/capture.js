import { sql } from './db.js';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

export async function captureScreenshot(urlId, url) {
  try {
    const response = await fetch(
      `https://chrome.browserless.io/screenshot?token=${process.env.BROWSERLESS_API_KEY}`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          url,
          options: { fullPage: true, type: 'png' },
          viewport: { width: 1440, height: 900 },
          gotoOptions: { waitUntil: 'networkidle2', timeout: 30000 },
        }),
      }
    );

    if (!response.ok) {
      const err = await response.text();
      return { success: false, error: `Browserless error: ${err}` };
    }

    const buffer = await response.arrayBuffer();
    const fileBuffer = Buffer.from(buffer);
    const filename = `${urlId}_${Date.now()}.png`;

    // Upload to Supabase Storage
    const { error: uploadError } = await supabase.storage
      .from('screenshots')
      .upload(filename, fileBuffer, {
        contentType: 'image/png',
        upsert: false,
      });

    if (uploadError) {
      return { success: false, error: `Upload error: ${uploadError.message}` };
    }

    // Get public URL
    const { data } = supabase.storage
      .from('screenshots')
      .getPublicUrl(filename);

    const publicUrl = data.publicUrl;
    const fileSize = fileBuffer.length;

    // Save to database
    await sql`
      INSERT INTO screenshots (url_id, filename, filepath, file_size)
      VALUES (${urlId}, ${filename}, ${publicUrl}, ${fileSize})
    `;

    await sql`
      UPDATE urls SET last_captured_at = NOW() WHERE id = ${urlId}
    `;

    return { success: true, filepath: publicUrl };
  } catch (err) {
    return { success: false, error: err.message };
  }
}