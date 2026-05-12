# DX Report - Copy-Ghost
## Jupiter Developer Platform - Honest Developer Feedback

## Onboarding
Getting started was faster than expected. Landing on developers.jup.ag, creating an account, and getting an API key took about four minutes. No friction there at all. The unified key concept is genuinely good - one key for every API is the right call and I wish more platforms did this.
The first successful API call happened about twelve minutes after landing on the platform. We hit the Price API first because it was the simplest entry point. The docs showed the endpoint clearly and the response came back clean.
Where things got confusing immediately: there is no upfront warning that calling Jupiter APIs directly from the browser will fail with a CORS error. We wasted about forty minutes assuming we had the wrong API key or the wrong endpoint before realizing the issue was CORS entirely. This is not documented on the getting started page. For developers building with Next.js or any frontend framework, a single line saying "all API calls must be server-side" would have saved us significant time.

## Price API
This was the smoothest part of the entire integration. The endpoint is clean, the response structure is predictable, and the data is accurate.
One thing that caught us: the response field changed between versions. We were initially reading data.price but the actual field in the v2 response is nested differently depending on whether you pass one token or multiple. When you pass a single token ID, the response wraps it in the token's mint address as the key. When you pass multiple, it returns an object with each mint as a key. This asymmetry is not clearly documented and caused a silent bug where our price display showed undefined for about two hours before we traced it.
We ended up building a Next.js route handler at /api/price to proxy all requests. This solved the CORS problem and let us keep the API key server-side. The proxy adds about 15ms of latency which is acceptable.
Rate limits: we never hit them during development with a 10 second cache on our proxy. The limits themselves are not prominently documented. We had to hunt for them.

## Swap V6
This is where the real complexity lives and where the documentation falls short.
The split between /quote and /swap makes sense architecturally but the docs do not explain clearly why you need two calls or what state lives between them. We understood it eventually: /quote builds the transaction and /swap generates the final payload with Jupiter handling the landing. But we spent time trying to submit the transaction ourselves before realizing the managed flow is much better.
The gasless swap feature is genuinely impressive but almost invisible in the docs. We only found out it existed by reading a community post, not the official documentation. This should be front and center because it fundamentally changes what you can build.
Error messages from the swap API are inconsistent. Sometimes you get a structured JSON error with a message field. Sometimes you get an empty body with a 400 status. Sometimes you get a 200 with an error nested inside the response body. We had to write defensive parsing that checked all three cases before we stopped getting silent failures.
The biggest practical issue: the swap transaction returned from the API expires quickly. If there is any delay between getting the transaction and executing it, the transaction is stale and will fail on chain. The documentation mentions this but does not tell you the exact expiry window. We had to discover through trial and error that anything over about 30 seconds is likely stale.

## Tokens API
The organic score is the most underused feature in the entire Jupiter platform. It is genuinely useful - we used it to filter tokens during session sweeps, flagging anything below a score of 70 as potentially suspicious before returning it to the vault.
The problem is the documentation for organic score is minimal. What does 0 mean versus 30 versus 70 versus 100? What signals contribute to the score? Is it updated in real time or batched? We never found answers to these questions in the docs. We chose 70 as our threshold based on gut feel, not documented guidance.
Token metadata is comprehensive and the logos load reliably. Symbol and name resolution works well for established tokens. For very new or obscure tokens the response sometimes comes back with null fields where you would expect data, which requires defensive handling throughout the UI.

## Trigger API
We used the Trigger API to enable limit orders placed directly from the vault wallet, which was one of the core security features of Copy-Ghost. The idea was that users could set limit orders without opening a session, keeping their vault unexposed.
The API works but the documentation around parameter formats is sparse. Specifically, makingAmount and takingAmount need to be passed as strings representing the raw token amount in the token's smallest unit (like lamports for SOL). This is not explicitly stated. We initially passed human-readable amounts and got confusing errors that did not point to the formatting issue.
Order cancellation works as documented. Order status polling works but there is no webhook or push notification system, so you have to poll manually. For a production product this would be a significant limitation. For a hackathon it is fine.

## AI Stack
We used AI pair-programmers throughout the build.
The Jupiter Agent Skills were helpful as a starting reference but they became outdated quickly when we hit edge cases. The skills describe happy-path integration well but do not cover error handling, CORS issues, or the versioning differences between API responses. When the agent hit problems it could not solve from the skills alone, it defaulted to guessing, which caused more problems than it solved.
We did not use the Jupiter CLI. Our use case was a web application and the CLI felt oriented toward scripting and automation workflows. For our needs it would have added complexity without benefit.
The Docs MCP would have been valuable but we ran into access issues during the build and ended up reading the docs directly in the browser. The concept is right - giving an AI agent direct access to current documentation is genuinely useful and reduces hallucination. The execution needs work.
The llms.txt file was useful early on for giving the agent a structured overview of what APIs exist. It is not a substitute for the full docs but it helped orient the agent at the start of each session.

## If We Were Building developers.jup.ag
The platform is good. These are the things we would change based on a week of real usage.
First, put a CORS warning on every API endpoint page. Not buried in a FAQ. Right next to the code example. Every frontend developer building their first integration will hit this. It is the single highest-friction moment in onboarding and it is entirely preventable with one sentence.
Second, the organic score needs a dedicated explanation page. What is it measuring? What are the thresholds? How often is it updated? Right now it is a number with no context. With proper documentation it becomes one of the most powerful signals on Solana for distinguishing real token activity from manufactured volume.
Third, Swap V6 error responses need to be standardized. Pick one format and use it everywhere. The current inconsistency between structured errors, empty bodies, and nested errors forces every developer to write defensive parsing code that should not be necessary.
Fourth, the gasless swap feature deserves a dedicated section on the landing page. It is the most differentiated technical feature Jupiter has and it is currently buried. Developers building for users who do not hold SOL - which is a huge audience - need to find this immediately.
Fifth, add transaction expiry times to the Swap documentation. Tell developers exactly how long they have between getting the transaction from /order and executing it. This is critical timing information that is currently undocumented.

## What We Wish Existed
A webhook system for Trigger API order execution. Right now you poll. For any production application that needs to react to order fills in real time, polling is the wrong pattern. A webhook that fires when an order executes would make the Trigger API significantly more powerful.
A sandbox mode with simulated token balances. Testing swap flows requires real tokens on devnet, which means constantly managing faucet balances. A sandbox that simulates balances and transactions without touching the chain would dramatically speed up development and testing.
An organic score changelog or freshness indicator on the Tokens API response. Knowing that a score was last updated 3 hours ago versus 3 days ago would change how you use it in time-sensitive applications like ours.
Better error codes. Right now errors are strings. Structured error codes that map to specific failure modes would make it much easier to handle errors programmatically and show users meaningful messages instead of raw API error text.
