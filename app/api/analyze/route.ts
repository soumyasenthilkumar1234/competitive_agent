import { NextResponse } from 'next/server';
import { execFile } from 'child_process';
import { promisify } from 'util';

const execFilePromise = promisify(execFile);

export async function POST(req: Request) {
  try {
    const { urls, user_product_data } = await req.json();

    if (!urls || !Array.isArray(urls) || urls.length === 0) {
      return NextResponse.json({ error: 'URLs array is required' }, { status: 400 });
    }

    if (!user_product_data) {
      return NextResponse.json({ error: 'User product data is required' }, { status: 400 });
    }

    // Executing the Python backend via CLI
    // Ensure the path is correct for Windows venv
    const pythonPath = 'backend\\venv\\Scripts\\python'; 
    const scriptPath = 'backend/main.py';
    
    try {
      // Use execFile instead of exec to avoid shell interpretation of characters like '&'
      const args = [
        scriptPath,
        '--urls',
        JSON.stringify(urls),
        '--user_product_data',
        JSON.stringify(user_product_data)
      ];
      
      const { stdout, stderr } = await execFilePromise(pythonPath, args);
      
      if (stderr && !stdout) {
        console.error('Python Error:', stderr);
        return NextResponse.json({ error: 'Backend execution failed' }, { status: 500 });
      }

      // The Python script prints the JSON result to stdout
      const result = JSON.parse(stdout);
      return NextResponse.json(result);

    } catch (execError: any) {
      console.error('Execution error:', execError);
      return NextResponse.json({ error: 'Failed to execute analysis agent' }, { status: 500 });
    }

  } catch (error) {
    console.error('Analysis error:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
