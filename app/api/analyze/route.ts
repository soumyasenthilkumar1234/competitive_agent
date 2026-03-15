import { NextResponse } from 'next/server';
import { execFile } from 'child_process';
import { promisify } from 'util';

const execFilePromise = promisify(execFile);

export async function POST(req: Request) {
  try {
    const { urls, user_selection, competitor_name, platforms, user_product_data, search_only, seller_url } = await req.json();

    const pythonPath = 'backend\\venv\\Scripts\\python'; 
    const scriptPath = 'backend/main.py';
    
    try {
      const args = [
        scriptPath,
        '--user_product_data',
        JSON.stringify(user_product_data || {})
      ];

      if (seller_url) {
        args.push('--seller_url', seller_url);
      }

      const selection = user_selection || urls || [];
      if (selection && Array.isArray(selection) && selection.length > 0) {
        args.push('--user_selection', JSON.stringify(selection));
      }

      if (competitor_name) {
        args.push('--competitor_name', competitor_name);
      }

      if (platforms && Array.isArray(platforms) && platforms.length > 0) {
        args.push('--platforms', JSON.stringify(platforms));
      }

      if (search_only) {
        args.push('--search_only');
      }
      
      const { stdout, stderr } = await execFilePromise(pythonPath, args, {
        maxBuffer: 20 * 1024 * 1024, // 20MB
        timeout: 120000,             // 120 seconds for crawling
      });
      
      if (stderr) {
        console.warn('Python Stderr:', stderr);
      }

      if (!stdout) {
        return NextResponse.json({ error: 'Backend returned no data', stderr }, { status: 500 });
      }

      const result = JSON.parse(stdout);
      return NextResponse.json(result);

    } catch (execError: any) {
      console.error('Execution error:', execError);
      return NextResponse.json({ 
        error: 'Failed to execute agent', 
        details: execError.message,
        stderr: execError.stderr 
      }, { status: 500 });
    }

  } catch (error) {
    console.error('API error:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
