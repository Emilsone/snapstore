import { sql } from './db.js';

function getSupabase() {
  const { createClient } = require('@supabase/supabase-js');
  return createClient(
    process.env.SUPABASE_URL,
    process.env.SUPABASE_SERVICE_ROLE_KEY
  );
}

export async function captureScreenshot(urlId, url) {
  try {

    const params = new URLSearchParams({
      api_key: process.env.SCRAPINGBEE_API_KEY,
      url: url,
      screenshot: 'true',
      screenshot_full_page: 'true',
      block_ads: 'true',
    });

    const response = await fetch(
      `https://app.scrapingbee.com/api/v1/?${params.toString()}`,
      { method: 'GET' }
    );

    if (!response.ok) {
      const err = await response.text();
      return { success: false, error: `ScrapingBee error: ${err}` };
    }

    const buffer = await response.arrayBuffer();
    const fileBuffer = Buffer.from(buffer);
    const filename = `${urlId}_${Date.now()}.png`;

    // Upload to Supabase Storage
    const supabase = getSupabase();

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