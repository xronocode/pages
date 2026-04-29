---
layout: default
title: "AI Stratification"
parent: Blog
nav_exclude: true
---

# AI Stratification: Why Generative AI Did Not Spread Like Smartphones

<div class="article-actions">
  <a href="ai-stratification.html">RU mirror</a>
  <a href="https://habr.com/ru/articles/1027738/">Habr original</a>
  <a href="ai-stratification-en.html">EN translation</a>
</div>

*April 24, 2026*

There is a persistent stereotype: new technologies are always the domain of the young. It was true for smartphones. It was true for social networks. Young people try first and go deeper, while older audiences catch up three to five years later.

For the second year now, generative AI feels different to me. Among the people I observe in the industry, at conferences, in work chats, and on Habr, the deepest users are not 22-year-old "digital natives." They are engineers, architects, team leads, and - more surprisingly - executives with 15 to 20 years of experience. The very people who usually adopt a new stack last.

Maybe this is just my perception. Maybe it is survivorship bias and my bubble is unusual. So I decided to check whether there is real data behind the impression.

**Short answer:** yes, there is. And the picture is more interesting than "young people are ahead."

## Two dimensions that are often confused

When we ask "who uses AI?", we are actually asking two different questions. The answers point in opposite directions.

![Top row: reach, decreasing with age. Bottom row: depth of work use, peaking among experienced professionals and managers.](https://habrastorage.org/r/w1560/getpro/habr/upload_files/218/3ee/a62/2183eea62e2fbe26b6a552bb7d68a97b.png)

*Top row: reach, from 58% among younger users to 10% among 55+. Bottom row: depth of work use, peaking among 35-44-year-olds and executives.*

**1. Breadth, or trial use.** Here younger people really do lead, as expected.

Pew Research and Reuters Institute data from 2025 show that 58-59% of Americans aged 18-29 have tried ChatGPT or GenAI at least once. Among 50-64-year-olds the figure is about 25%, and among 65+ around 10%.

- Reuters Institute: 59% of 18-24-year-olds use GenAI weekly, compared with 20% among 55+.
- OpenAI, analyzing about 1.5 million conversations, found that roughly half of all messages come from users under 26.

This is the classic age gradient we saw with smartphones.

**2. Depth, or serious work use.** Here the picture flips.

- McKinsey, *Superagency in the Workplace* (October 2024, n=3,613): 62% of people aged 35-44 report "extensive expertise" in GenAI, the maximum among all age groups. Gen Z is at 50%.
- BCG, *AI at Work 2025*: 88% of executives and 78% of managers use GenAI several times per week. Among individual contributors the figure is only 51%.
- Slack/Salesforce (2025): one in three millennials, aged 28-43, uses GenAI **daily at work** and redesigns workflows around it. Gen Z uses it often, but mostly for study and personal tasks.

**The conclusion is simple:** young people are not falling behind. They are using AI on a different territory and with a different payoff. Researchers reach "contradictory" conclusions because they measure different things.

At the end of the Russian article I launched a poll. I am not sure the article will get enough reach, but I am sure the right question is not "who uses AI?" The right question is: **who uses AI, and how?**

### Cognitive tools historically started with experienced professionals

It turns out that the stereotype "the young are always first" is built mostly on two bright cases: social networks and the iPhone. For productivity tools, the picture has usually been the opposite.

- VisiCalc and Lotus 1-2-3 (1979-1987), the first best-selling PC applications: early users were accountants, analysts, and managers.
- Early commercial internet (1995-1996): the typical user was an educated man over 40.
- BlackBerry (2002-2008): average age 38, with 48% managers and C-level.

An interesting meta-analysis of 470 studies on diffusion of innovation (Riverola et al., 2017) reports that age is the weakest predictor of early adoption. Education and income matter much more.

GenAI is a hybrid. In breadth it behaves like a consumer product. In depth it behaves like a classic enterprise tool. So both statements - "young people are ahead" and "experienced professionals are ahead" - are true on different axes.

### Why expertise gives a huge advantage with AI

**1. Domain knowledge as a multiplier**  
Ethan Mollick of Wharton introduced the idea of the *jagged frontier*: the uneven boundary of what the model can do. In a BCG experiment with 758 consultants, those working inside the model's capability frontier completed 12% more tasks, worked 25% faster, and improved quality by 40%. Outside the frontier, they performed 19 percentage points worse than the control group. A novice simply cannot see that boundary.

**2. The pointing problem**  
Tyler Cowen put it well: generic questions produce generic answers. A quality prompt is a function of the operator's vocabulary, knowledge system, and ability to decompose the task. In other words, it is a function of domain expertise.

**3. Verification ability**  
Microsoft's Copilot study of 5,000+ developers found that senior engineers accept model suggestions 4.3% less often. They see bad code better. Juniors may get a larger increase in output volume, but architectural quality is higher with seniors.

**4. The ten-hour rule**  
Mollick's practical observation: it takes roughly ten hours of deliberate experimentation to "switch on" with AI. A student using ChatGPT for homework one hour a week will cross that threshold slowly. An engineer writing specifications every day will cross it in a few days. You already know there are two kinds of people: those constantly annoyed that they hit the limit again, and those who cannot understand how anyone can spend more than a five-hour quota in one day.

### What Habr has already discussed

The community is actively discussing this.

- diffnotes-tech, "A senior without AI is the new junior" (April 2026), uses the term "AI stratification" and gives examples of advanced users: Steve Yegge, Kent Beck, Boris Cherny.
- An executive with 20 years of experience, in "300 days with AI agents," returned to active development through Cursor and Claude and produced 759 contributions in a year instead of 18.
- st-korn, "Vibe coding through the eyes of an old developer," shows how an experienced person gets a qualitatively different result from the model.
- K2's corporate case, "We lived with Copilot for a year," on 600+ developers: seniors are the ones who unlock the full potential of the tool.

### Where the hypothesis breaks

To be fair, the picture is not universal.

- **India** (BCG 2025): AI usage reaches 92%, the highest in the world. Adoption is bottom-up; young people are ahead of managers.
- **Denmark** (Humlum & Vestergaard, PNAS 2025): each additional year of age reduces usage probability by about 1%. Young people lead in depth as well.
- **METR experiment** (2025): developers using AI worked 19% slower while believing they were faster. A serious warning for every "100x" story.
- Young people also reach depth, but often in personal and educational domains, as Sam Altman has noted in interviews.

### The broken career ladder: what is happening to hiring

The most worrying consequence as of April 2026 is the sharp decline in junior hiring.

Stanford Digital Economy Lab and Harvard, using data on 62 million workers, report a 13-16% relative employment decline among 22-25-year-olds in occupations exposed to AI. On Habr, diffnotes-tech cites Revelio Labs: entry-level vacancies down 35%, and juniors' share of hiring down from 15% to 7%.

This creates a paradox: without juniors, in five to ten years there will be a shortage of mature professionals. As the HR director of Diasoft put it, "the main value of a junior is that one day they become a senior."

Important caveat: the causal link "AI -> collapse in junior hiring" has not yet been proven, though there is less and less doubt. Some economists connect the decline to the market cycle.

### My conclusions

The hypothesis "with GenAI everything is reversed: veterans are ahead" is partly confirmed, but it needs precision.

The real variable is not age itself. The real variables are **domain expertise + organizational leverage + ability to verify** the model. A 40-year-old engineer has these. A 22-year-old intern usually does not yet.

But a 22-year-old who deliberately builds expertise and learns to work with AI as a "centaur" - in the Harvard Business School sense, a person who strategically divides work with AI while retaining control - may in ten years have a stronger profile than any previous generation. Although predicting what happens in ten years is now a dangerous sport.

Diffusion theory is not cancelled. It is refined. For cognitive tools, "early adopter" is defined less by year of birth and more by education and professional position.

**For those over 35:** your expertise is exactly the resource AI multiplies most strongly.

**For those under 25:** AI does not remove the need to build a foundation. Delegating thinking to a model without your own coordinate system means multiplying zero.

One last observation: I did not find detailed quantitative data on AI adoption by "grade x age" for the Russian-speaking market. Habr, HH, GetMatch, and Habr Career do not seem to publish such a slice yet. The closest I found was: [38% of specialists consider AI a useful assistant at work](https://www.kommersant.ru/doc/8589609).

If any reader has such data, comments are welcome.

### Sources

**Global studies and reports:**

- [McKinsey, "Superagency in the Workplace"](https://www.mckinsey.com/capabilities/tech-and-ai/our-insights/superagency-in-the-workplace-empowering-people-to-unlock-ais-full-potential-at-work)
- [BCG, "AI at Work 2025"](https://www.bcg.com/publications/2025/ai-at-work-momentum-builds-but-gaps-remain)
- [Pew Research, ChatGPT usage by age](https://www.pewresearch.org/short-reads/2025/06/25/34-of-us-adults-have-used-chatgpt-about-double-the-share-in-2023/)
- [Reuters Institute Digital News Report 2025](https://reutersinstitute.politics.ox.ac.uk/digital-news-report/2025)
- [Microsoft Work Trend Index](https://www.microsoft.com/en-us/worklab/work-trend-index/ai-at-work-is-here-now-comes-the-hard-part)
- [Anthropic Economic Index](https://www.anthropic.com/research/the-anthropic-economic-index)
- [OpenAI/NBER, Chatterji, Cunningham, Deming, 2025](https://www.nber.org/system/files/working_papers/w34255/w34255.pdf)
- [Stanford Digital Economy Lab, 2025 year in review](https://digitaleconomy.stanford.edu/news/2025-year-in-review/)
- [Generative AI as Seniority-Biased Technological Change](https://papers.ssrn.com/sol3/papers.cfm?abstract_id=5425555)
- [HBS/BCG jagged frontier study](https://www.hbs.edu/faculty/Pages/item.aspx?num=64700)
- [Microsoft Copilot study](https://papers.ssrn.com/sol3/papers.cfm?abstract_id=4945566)
- [Humlum & Vestergaard, PNAS 2025](https://www.pnas.org/doi/10.1073/pnas.2414972121)
- [METR experiment](https://metr.org/blog/2026-02-24-uplift-update/)
- [Riverola et al., innovators and early adopters](https://www.researchgate.net/publication/335325901_Innovators_and_Early_Adopters_in_the_Diffusion_of_Innovations_A_Literature_Review)
- [Economic Innovation Group, Iscenko & Millet](https://www.piie.com/blogs/realtime-economics/2026/research-ai-and-labor-market-still-first-inning)

**Habr publications:**

- [diffnotes-tech, "A senior without AI is the new junior"](https://habr.com/ru/articles/1019748/)
- ["300 days with AI agents"](https://habr.com/ru/articles/983808/)
- [st-korn, "Vibe coding through the eyes of an old developer"](https://habr.com/ru/articles/943856/)
- [K2, "We lived with Copilot for a year"](https://habr.com/ru/companies/k2tech/articles/1017022/)
- ["AI Dev Day - the AI fever continues"](https://habr.com/ru/companies/betboom/articles/1011308/)
- [sound_right, "How mindless AI use kills expertise"](https://habr.com/ru/articles/977828/)
- [diffnotes-tech, "Juniors are no longer hired"](https://habr.com/ru/articles/1010680/)
- [Diasoft, "Why juniors are not always hired in IT"](https://habr.com/ru/companies/diasoft_company/articles/1012420/)
