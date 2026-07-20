# genai_batch1_project_1
AI resume Builder

input: personal data, technical data, Expereince, projects
output: ATS optimised best resume

# step 1
Personal data:
Name, email, mobile number, links (linkedin, project link)

Technical Skills:
reactjs, python, genai, core java, mysql

Expereince:
2 years

Project data:
i worked on carpooling company quickride. developed website, worked on both ui and backend. little bit expereince in aws services like ec2, s3, cloudfront.

2nd project: taxaition.com AI powered ITR filing website, worked on backend only.

# step 2
check missing pieces, confirm and collect from user. 

# step 3
generate content

# step 4
approval and rewrite

# confirm and generate docx, pdf

UI:
Textbox: user chat -> UI block -> API call -> receive data, llm, 
AI replies

Resume content -> UI block -> API

Textbox -> rewrite -> API
Buttons -> approval -> API

generate files -> API -> tools
Download option


# folder structure


# clone project
# install dependecies
run pip install -r requirements.txt 
# run server
uvicorn app:app --reload


npm install -g @anthropic-ai/claude-code

/login
/model

claude --dangerously-skip-permissions

prject discussion with claude: https://claude.ai/share/e457d3a9-18b4-4650-9dca-8b4590e84de9


