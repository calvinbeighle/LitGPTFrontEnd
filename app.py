from flask import Flask, jsonify
import requests
import feedparser
from scidownl import scihub_download
from openai import OpenAI
client = OpenAI(
  api_key='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',
)

app = Flask(__name__)

@app.route('/api/search')
def search_papers(query):
    url = f'http://export.arxiv.org/api/query?search_query={query}&start=0&max_results=10'
    response = requests.get(url)
    feed = feedparser.parse(response.content)
    dois = []

    for entry in feed.entries:
        if 'arxiv_doi' in entry:
            dois.append(entry.arxiv_doi)

    # Consider handling the download in a different way, as it might be time-consuming
    # For example, you can queue these for a background process

    return jsonify({'dois': dois})


@app.route('/api/llm')
def search_papers(query):

    completion = client.chat.completions.create(
    model="gpt-3.5-turbo",
    messages=[
        {"role": "system", "content": "When someone requests for information on a specific drug, return exactly just {LIT} and only this token. When a user asks for a simulation, return exactly just {SIM}, and only this token. Otherwise, follow their procedure"},
        {"role": "user", "content": f"{query}"}
    ]
    )

    print(completion.choices[0].message)



# def get_molecule_image():
#     smiles = request.json.get('smiles')
#     mol = Chem.MolFromSmiles(smiles)
#     img = Draw.MolsToGridImage([mol], molsPerRow=1, useSVG=True)

#     # Convert to base64 for easy transmission
#     output = BytesIO()
#     img.save(output, format="PNG")
#     encoded_string = base64.b64encode(output.getvalue()).decode()

#     return jsonify({'image': encoded_string})

if __name__ == '__main__':
    app.run(debug=True)