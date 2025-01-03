from pymongo import MongoClient
import re
import nltk
from nltk.corpus import stopwords
from nltk.tokenize import word_tokenize
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.metrics.pairwise import cosine_similarity
from dotenv import load_dotenv
import os

load_dotenv()

nltk.download('punkt')
nltk.download('stopwords')

class NBANewsSearchEngine:
    def __init__(self, 
                 mongo_uri=os.getenv('MONGDB_ATLAS_URI'), 
                 database_name=os.getenv('MONGO_DB_NAME'), 
                 collection_name=os.getenv('MONGO_NEWS_COLLECTION_NAME')):
        self.client = MongoClient(mongo_uri)
        self.db = self.client[database_name]
        self.collection = self.db[collection_name]
        
        self.prepare_search_data()
    
    def preprocess_text(self, text):
        if not isinstance(text, str):
            text = str(text)    
        
        text = text.lower()
        text = re.sub(r'[^a-zA-Z\s]', '', text)
        
        tokens = word_tokenize(text)
        
        stop_words = set(stopwords.words('english'))
        tokens = [token for token in tokens if token not in stop_words]
        
        return ' '.join(tokens)
    
    def prepare_search_data(self):
        self.articles = list(self.collection.find())
        
        self.processed_contents = [
            self.preprocess_text(article.get('content', '') + ' ' + 
                                  article.get('title', '') + ' ' + 
                                  article.get('subtitle', '')) 
            for article in self.articles
        ]
        
        self.vectorizer = TfidfVectorizer()
        self.tfidf_matrix = self.vectorizer.fit_transform(self.processed_contents)
    
    def cosine_similarity_search(self, query, top_k=5):        
        processed_query = self.preprocess_text(query)
        query_vector = self.vectorizer.transform([processed_query])
                
        similarities = cosine_similarity(query_vector, self.tfidf_matrix)[0]
                
        non_zero_similarities = [(idx, score) for idx, score in enumerate(similarities) if score > 0]
                
        sorted_non_zero = sorted(non_zero_similarities, key=lambda x: x[1], reverse=True)
                
        top_indices = [idx for idx, _ in sorted_non_zero[:top_k]]
                
        results = [
            {
                'article': {
                    '_id': str(self.articles[idx]['_id']),
                    'title': self.articles[idx].get('title', ''),
                    'subtitle': self.articles[idx].get('subtitle', ''),
                    'content': self.articles[idx].get('content', ''),
                    'link': self.articles[idx].get('link', ''),
                    'date': self.articles[idx].get('date', ''),
                    'wp_image': self.articles[idx].get('wp_image', '')
                },
                'similarity_score': float(similarities[idx])
            }
            for idx in top_indices
        ]
        
        return results
    
    def jaccard_similarity(self, str1, str2):
        set1 = set(str1.split())
        set2 = set(str2.split())
        
        intersection = len(set1.intersection(set2))
        union = len(set1.union(set2))
        
        return intersection / union if union != 0 else 0
    
    def jaccard_similarity_search(self, query, top_k=5):
        processed_query = self.preprocess_text(query)
        
        similarities = [
            self.jaccard_similarity(processed_query, content)
            for content in self.processed_contents
        ]
        
        non_zero_similarities = [(idx, score) for idx, score in enumerate(similarities) if score > 0]
        
        sorted_non_zero = sorted(non_zero_similarities, key=lambda x: x[1], reverse=True)
        
        top_indices = [idx for idx, _ in sorted_non_zero[:top_k]]
        
        results = [
            {
                'article': {
                    '_id': str(self.articles[idx]['_id']),
                    'title': self.articles[idx].get('title', ''),
                    'subtitle': self.articles[idx].get('subtitle', ''),
                    'content': self.articles[idx].get('content', ''),
                    'link': self.articles[idx].get('link', ''),
                    'date': self.articles[idx].get('date', ''),
                    'wp_image': self.articles[idx].get('wp_image', '')
                },
                'similarity_score': float(similarities[idx])
            }
            for idx in top_indices
        ]

        return results
