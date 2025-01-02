import time
import threading
from flask import Flask
from flask_cors import CORS
from flask_socketio import SocketIO
from searchEngine import NBANewsSearchEngine

app = Flask(__name__)
CORS(app)
socketio = SocketIO(app, cors_allowed_origins="*")

search_engine = NBANewsSearchEngine()

def perform_cosine_search(query, top_k, sid):
    start_time = time.time()
    results = search_engine.cosine_similarity_search(query, top_k)
    end_time = time.time()
    
    computation_time = end_time - start_time
    socketio.emit('cosine_results', {
        'results': results,
        'results_length': len(results),
        'computation_time': computation_time,
        'sid': sid
    })

def perform_jaccard_search(query, top_k, sid):
    start_time = time.time()
    results = search_engine.jaccard_similarity_search(query, top_k)
    end_time = time.time()
    
    computation_time = end_time - start_time
    socketio.emit('jaccard_results', {
        'results': results,
        'results_length': len(results),
        'computation_time': computation_time,
        'sid': sid
    })

@socketio.on('search_request')
def handle_search_request(data):
    query = data.get('query', '')
    top_k = data.get('top_k', 50)
    sid = data.get('sid')
    
    cosine_thread = threading.Thread(
        target=perform_cosine_search, 
        args=(query, top_k, sid)
    )
    jaccard_thread = threading.Thread(
        target=perform_jaccard_search, 
        args=(query, top_k, sid)
    )
    
    cosine_thread.start()
    jaccard_thread.start()

if __name__ == '__main__':
    socketio.run(app, host='0.0.0.0', port=5000, debug=True)
