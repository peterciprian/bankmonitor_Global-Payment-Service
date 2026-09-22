Google Gemini:
#1 pasted the description, with small modifications, like frontend stack, but dindt ask anything specifically.
#2 `A fejlesztés GitHub Copilot segítségével fog történni. Mielőtt az implementácba kezdünk a fenti köveztelményeket gyűjtsük ki egy fájlba pontos meghatározással, utasításokkal, amit  GitHub Copilot feldolgoz és figyelembe vesz mindnen fejlesztési lépés során. (külön .md fájl) A fejlesztés során minden döntést szeretnék feljegyezni, indoklással. (decision-log.md) vezessük a readme.md-t a  követelményben meghatározottak szerint.`
#3 `Legyél a lead sowftware engineer, vezess végig a technológiákon melyiket miért vezessük be, milyen előnyei és hátrányai vannak, miért ezt választottad, milyen alternatívák ellenében.`
#4 `A fejlesztést egy részletes, a fenti követelmények alapján felállított TODO lista elkészítésével kezdjük, majd ezeken fogunk végighaladni. Így mindegyik listaelemhez szükség lesz egy részletes parancsra, ami alaján az implementáció készül. (backlog.md)`
#5 `Írj dokumentációt teljeskörű vállalati szintű unit és e2e tesztelésre vonatkozó előírásokról és iránymutatásokról. (testing-guidelines.md), a backlogot dolgozd át úgy, hogy az imlementáció magába foglalja a tesztek megírását is, mind unit, integrációs éa e2e teszt szintjén.`

Github Copilot:

#1 You are a Staff Fullstack Engineer guiding me through building a production-ready Next-Gen Payment Gateway. 

First, read and thoroughly analyze our source-of-truth files:
1. #file:system-requirements.md
2. #file:testing-guidelines.md (Strict test architecture rules)
3. #file:backlog.md
4. #file:decision-log.md
5. #file:README.md

Your task is to help me execute the project strictly step-by-step following the sequence in `backlog.md`. Do not skip ahead. 

To start, let's look at "Task 1: Backend Domain Models, Locking & Unit Tests". Review its technical prompt inside `backlog.md`, and generate the clean, complete Java source code. Ensure it adheres perfectly to Java 21, Spring Boot 4.x, and the data integrity rules specified.
After finishing the task, update the backlog and if it is needed, the README.md also.
In case of need for technical decision, always ask me, offer solutions, provide context, explain tradeoffs.
