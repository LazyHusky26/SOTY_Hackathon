from flask import Flask, request, jsonify
from flask_cors import CORS
import subprocess
import sys

app = Flask(__name__)
CORS(app)  # Enable CORS for React frontend

@app.route('/api/reconstruct', methods=['POST'])
def api_reconstruct():
    try:
        print("API endpoint hit!")
        data = request.get_json()
        print(f"Received data: {data}")
        
        fragment = data.get('fragment', '').strip()
        print(f"Fragment length: {len(fragment)} characters")
        print(f"Fragment: {fragment[:100]}{'...' if len(fragment) > 100 else ''}")
        
        if not fragment:
            return jsonify({'error': 'No fragment provided'}), 400
        
        if len(fragment) > 1000:
            return jsonify({'error': 'Fragment too long. Please use shorter text (max 500 characters).'}), 400
        
        # Call the main.py script directly (since it works)
        print("Calling main.py script...")
        result = subprocess.run([
            sys.executable, 'main.py', fragment
        ], capture_output=True, text=True, timeout=300)  # Increased to 5 minutes
        
        print(f"Return code: {result.returncode}")
        print(f"Stdout: {result.stdout}")
        if result.stderr:
            print(f"Stderr: {result.stderr}")
        
        if result.returncode != 0:
            return jsonify({'error': f'Script failed: {result.stderr}'}), 500
        
        # Parse the output from main.py
        output = result.stdout
        
        # Extract original fragment
        original = fragment
        if '[Original Fragment]' in output:
            try:
                original_section = output.split('[Original Fragment]')[1].split('[AI-Reconstructed Text]')[0]
                if '> "' in original_section:
                    original = original_section.split('> "')[1].split('"')[0]
            except:
                pass
        
        # Extract reconstructed text
        reconstructed = "Processing completed"
        if '[AI-Reconstructed Text]' in output:
            try:
                reconstructed_section = output.split('[AI-Reconstructed Text]')[1].split('[Contextual Sources]')[0]
                if '> "' in reconstructed_section:
                    reconstructed = reconstructed_section.split('> "')[1].split('"')[0]
            except:
                pass
        
        # Extract sources
        sources = []
        if '[Contextual Sources]' in output and '* No relevant sources found.' not in output:
            try:
                sources_section = output.split('[Contextual Sources]')[1]
                for line in sources_section.split('\n'):
                    line = line.strip()
                    if line.startswith('* ') and 'http' in line:
                        # Parse: "* http://example.com (description)"
                        content = line[2:].strip()  # Remove "* "
                        if ' (' in content and content.endswith(')'):
                            link = content.split(' (')[0]
                            description = content.split(' (')[1][:-1]  # Remove closing )
                            sources.append({"link": link, "description": description})
            except:
                pass
        
        result_data = {
            'original': original,
            'reconstructed': reconstructed,
            'sources': sources
        }
        print("Returning result...")
        return jsonify(result_data)
        
    except subprocess.TimeoutExpired:
        print("ERROR: Script timed out")
        return jsonify({'error': 'Processing timed out. Try a shorter fragment.'}), 500
    except Exception as e:
        print(f"ERROR: {str(e)}")
        import traceback
        traceback.print_exc()
        return jsonify({'error': str(e)}), 500

@app.route('/api/test', methods=['GET'])
def test():
    return jsonify({'message': 'API is working!'})

@app.route('/api/simple-test', methods=['POST'])
def simple_test():
    try:
        data = request.get_json()
        return jsonify({'received': data, 'status': 'success'})
    except Exception as e:
        return jsonify({'error': str(e)}), 500

if __name__ == '__main__':
    app.run(debug=True, port=5000)