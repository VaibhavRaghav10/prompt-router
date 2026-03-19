# 🧭 PromptRouter
> Intelligent routing for Large Language Models to optimize cost, speed, and quality.

---

## 📖 Overview
Using multiple Large Language Models (LLMs) in production can be expensive and inefficient. Not every prompt requires a heavy, costly model like GPT-4 or Claude 3 Opus; many can be efficiently handled by faster, cheaper models. **PromptRouter** is a routing layer designed to intercept user prompts and dynamically direct them to the most appropriate LLM. 

By acting as a smart proxy between your application and your AI models, PromptRouter aims to strike the perfect balance between cost, performance, and output quality.

---

## ✨ Features (Version 1)
This is an early-stage prototype focused on foundational mechanics. Current capabilities include:
* **Rule-Based Routing**: Directs prompts based on predefined logic and heuristics.
* **Simple Classification**: Evaluates prompt complexity against basic parameters to select a model.
* **Cost vs. Quality Optimization**: Enables cost savings by reserving high-tier models only for complex, compute-intensive requests.

---

## 🏗️ Architecture
At its core, PromptRouter intercepts the user query before it reaches an LLM Provider.

```text
User Input 
   │
   ▼
[ PromptRouter ] ──(Complexity/Rule Check)──┐
   │                                        │
   ├─► Simple Query ────────► [ Fast/Cheap LLM ]
   │                                        │
   └─► Complex Query ───────► [ Heavy/Smart LLM ]
                                            │
                                            ▼
                                        Response
```

---

## ⚙️ How It Works
1. **Intercept**: The user submits a prompt to the PromptRouter API endpoint.
2. **Evaluate**: The routing engine analyzes the prompt using rules, heuristics, and basic complexity classification (e.g., text length, exact keyword matching).
3. **Select**: Based on the evaluation score, the system selects the target LLM.
4. **Execute**: The prompt is forwarded to the selected model, and the generated response is returned back to the user.

---

## 💻 Tech Stack
* **Language**: Python 3.x
* **API Framework**: FastAPI
* **Architecture**: RESTful service with modular routing and scoring logic
* **Testing**: Pytest

---

## 🚀 Setup & Installation

**1. Clone the repository**
```bash
git clone https://github.com/VaibhavRaghav10/prompt-router.git
cd prompt-router
```

**2. Set up a virtual environment**
```bash
python3 -m venv venv
source venv/bin/activate
```

**3. Install dependencies**
```bash
cd backend
pip install -r requirements.txt
```

**4. Configure Environment Variables**
Create a `.env` file in the root directory and add your API keys for the providers you intend to use:
```bash
OPENAI_API_KEY=your_openai_key
ANTHROPIC_API_KEY=your_anthropic_key
```

**5. Run the server**
```bash
uvicorn app.main:app --reload
```

---

## 💡 Usage

Once the server is running, you can test the routing endpoint.

**Example Request:**
```bash
curl -X POST "http://localhost:8000/api/analyze" \
     -H "Content-Type: application/json" \
     -d '{"prompt": "Write a python script to reverse a string"}'
```

**Example Output:**
```json
{
  "selected_model": "gpt-3.5-turbo",
  "reason": "Low complexity, standard coding task",
  "response": "def reverse_string(s):\n    return s[::-1]"
}
```

---

## ⚠️ Limitations (Version 1)
This is an **early-stage prototype**, intended as a foundation for future development. Please note the following constraints:
* **Rule-Based Routing Only**: Routing is currently determined by hardcoded heuristics rather than dynamic machine learning models.
* **No Semantic Understanding**: The router cannot grasp the true nuance, context, or underlying meaning of a prompt.
* **No Evaluation Metrics**: There is no automated measurement or telemetry on how well the chosen model performs for a given prompt.
* **No Fallback Handling**: If a selected model API goes down or rate-limits the application, the request will currently fail without retrying a backup model.

---

## 🔮 Future Improvements
* **Semantic Routing**: Implementing vector embeddings to make routing decisions based on semantic meaning rather than basic text heuristics.
* **Cost-Aware Decision Making**: Real-time integration with token pricing to strictly adhere to custom token-budgets.
* **Evaluation Metrics**: Ground-truth benchmarking to continuously tune the router's accuracy and track output quality.
* **Fallback/Retry Logic**: Automatic failover to secondary/tier-2 models if the primary choice is unavailable.
* **Multi-Step Routing**: Orchestrating agentic workflows where a complex prompt is broken down and distributed to multiple specialized models simultaneously.

---

## 🌍 Why This Project Matters
As AI adoption grows, orchestration and optimization are becoming critical. Large-scale AI Systems, SaaS platforms, and autonomous agents cannot sustainably afford to forward every query to the most expensive model available. PromptRouter demonstrates the foundational mechanics of intelligent API management—an essential middleware pattern for the future of scalable, cost-effective GenAI applications.

---

## 🤝 Contributing
Contributions, issues, and feature requests are welcome! 
1. Fork the project
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

---
