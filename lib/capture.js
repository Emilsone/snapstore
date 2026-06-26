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
    if (url.startsWith('https:') && !url.startsWith('https://')) {
      url = url.replace('https:', 'https://');
    }
    if (url.startsWith('http:') && !url.startsWith('http://')) {
      url = url.replace('http:', 'http://');
    }

    const apiUrl = `https://app.scrapingbee.com/api/v1/?api_key=${process.env.SCRAPINGBEE_API_KEY}&url=${encodeURIComponent(url)}&screenshot=true&screenshot_full_page=true&block_ads=false&wait=5000&wait_for=networkidle&js_scenario=${encodeURIComponent(JSON.stringify({ instructions: [{ scroll_y: 3000 }, { wait: 4000 }, { scroll_y: 0 }, { wait: 6000 }] }))}`;

    const response = await fetch(apiUrl, { method: 'GET' });

    if (!response.ok) {
      const err = await response.text();
      return { success: false, error: `ScrapingBee error: ${err}` };
    }

    const buffer = await response.arrayBuffer();
    const fileBuffer = Buffer.from(buffer);
    const filename = `${urlId}_${Date.now()}.png`;


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


    const { data } = supabase.storage
      .from('screenshots')
      .getPublicUrl(filename);

    const publicUrl = data.publicUrl;
    const fileSize = fileBuffer.length;


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
