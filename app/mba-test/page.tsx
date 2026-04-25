'use client'

import { useState, useEffect, useRef } from 'react'
import { useRouter } from 'next/navigation'
import { ChevronLeft, ChevronRight, Clock, CheckCircle, Send, AlertTriangle, X } from 'lucide-react'

// ─── Valid Candidate IDs ───────────────────────────────────────────────────────
const VALID_IDS = Array.from({ length: 10 }, (_, i) =>
    `MBA_26_${String(i + 1).padStart(3, '0')}`
)
const STORAGE_KEY = 'mba_test_completed_ids'
const RESULTS_KEY = 'mba_test_results'

// ─── Question Bank ─────────────────────────────────────────────────────────────
const sections = [
    {
        id: 1, title: 'Quantitative & Analytical Aptitude', shortTitle: 'Quant', icon: '📊', color: 'blue',
        questions: [
            { id: 1, text: 'If the cost price of 25 articles is the same as the selling price of 20 articles, what is the profit percentage?', options: ['20%', '25%', '30%', '15%'], answer: 'B' },
            { id: 2, text: 'A sum of money invested at simple interest doubles itself in 10 years. In how many years will it become four times itself?', options: ['20 years', '30 years', '40 years', '25 years'], answer: 'B' },
            { id: 3, text: 'The average age of 10 students is 15 years. If a new student joins, the average age becomes 16 years. What is the age of the new student?', options: ['25 years', '26 years', '20 years', '21 years'], answer: 'B' },
            { id: 4, text: 'What is the mode of the following data set: 7, 8, 9, 7, 10, 11, 7, 8, 12?', options: ['8', '9', '7', '10'], answer: 'C' },
            { id: 5, text: 'If 12 workers can build a wall in 8 days, how many days will 6 workers take to build the same wall?', options: ['4 days', '16 days', '12 days', '10 days'], answer: 'B' },
            { id: 6, text: 'In a company, 40% of the employees are female. If there are 240 male employees, what is the total number of employees?', options: ['400', '360', '600', '480'], answer: 'A' },
            { id: 7, text: 'A bar chart shows that Department A contributed $50,000, Department B $70,000, and Department C $30,000. What % did Department B contribute?', options: ['30%', '35%', '40%', '45%'], answer: 'C' },
            { id: 8, text: 'Which of the following measures the spread of data points around the mean?', options: ['Mean', 'Median', 'Standard Deviation', 'Mode'], answer: 'C' },
            { id: 9, text: 'The ratio of two numbers is 5:7. If their difference is 12, what is the smaller number?', options: ['30', '42', '60', '72'], answer: 'A' },
            { id: 10, text: 'A car covers a distance of 180 km in 3 hours. What is its speed in meters per second?', options: ['15 m/s', '20 m/s', '25 m/s', '30 m/s'], answer: 'B' },
        ]
    },
    {
        id: 2, title: 'Business & Management Fundamentals', shortTitle: 'Business', icon: '💼', color: 'emerald',
        questions: [
            { id: 1, text: 'Which of the following is often considered the starting point for developing a marketing strategy?', options: ['Promotion', 'Price', 'Product', 'Place'], answer: 'C' },
            { id: 2, text: 'What financial metric indicates the efficiency with which a company is using its assets to generate earnings?', options: ['Gross Profit', 'Net Profit', 'Return on Investment (ROI)', 'Revenue'], answer: 'C' },
            { id: 3, text: 'In a SWOT analysis, which category represents internal factors that are favorable to achieving the objective?', options: ['Strengths', 'Weaknesses', 'Opportunities', 'Threats'], answer: 'A' },
            { id: 4, text: 'The coordination of all activities involved in moving a product from its origin to the point of consumption is known as:', options: ['Marketing Logistics', 'Supply Chain Management', 'Operations Planning', 'Financial Control'], answer: 'B' },
            { id: 5, text: 'A detailed plan outlining how a company will generate revenue and make a profit is called a:', options: ['Marketing Plan', 'Business Model', 'Strategic Vision', 'Financial Statement'], answer: 'B' },
            { id: 6, text: "Which of the following is a key component of the 'Promotion' aspect of the marketing mix?", options: ['Product design', 'Pricing strategies', 'Advertising and public relations', 'Distribution channels'], answer: 'C' },
            { id: 7, text: 'What is the term for the total amount of money a company receives from its sales of goods or services?', options: ['Profit', 'Revenue', 'Cost', 'Margin'], answer: 'B' },
            { id: 8, text: "The primary purpose of a 'Mission Statement' for a business is to:", options: ['Outline daily operational tasks.', "Define the company's fundamental purpose and values.", 'Detail the financial projections for the next quarter.', 'Describe the product features.'], answer: 'B' },
            { id: 9, text: 'Which of the following is an example of a variable cost?', options: ['Annual insurance premiums', 'Rent for the factory', 'Raw materials used in production', 'Salaries of administrative staff'], answer: 'C' },
            { id: 10, text: "'Market Segmentation' is the process of:", options: ['Selling products in different markets.', 'Dividing a broad consumer market into sub-groups based on shared characteristics.', 'Setting prices for products.', 'Promoting products through various channels.'], answer: 'B' },
        ]
    },
    {
        id: 3, title: 'Research & Analytical Thinking', shortTitle: 'Research', icon: '🔍', color: 'purple',
        questions: [
            { id: 1, text: 'Which type of research relies on existing data that has already been collected for other purposes?', options: ['Primary research', 'Secondary research', 'Experimental research', 'Observational research'], answer: 'B' },
            { id: 2, text: 'A researcher conducts in-depth interviews with a small group of consumers to understand their perceptions of a brand. This is an example of:', options: ['Quantitative data collection', 'Primary qualitative data collection', 'Secondary quantitative data collection', 'Experimental design'], answer: 'B' },
            { id: 3, text: 'A testable statement that proposes a possible explanation for an observed phenomenon is called a:', options: ['Theory', 'Law', 'Hypothesis', 'Conclusion'], answer: 'C' },
            { id: 4, text: 'Which data collection method involves systematically observing and recording behaviors or events without direct interaction?', options: ['Surveys', 'Interviews', 'Focus Groups', 'Observation'], answer: 'D' },
            { id: 5, text: 'The systematic gathering, recording, and analysis of data about issues relating to marketing products and services is known as:', options: ['Sales Forecasting', 'Market Research', 'Product Development', 'Brand Management'], answer: 'B' },
            { id: 6, text: 'When interpreting a case study, what is the primary goal?', options: ['To find a single correct answer.', 'To apply theoretical knowledge to a real-world business situation and propose actionable solutions.', 'To summarize the case without offering any analysis.', 'To criticize the decisions made by the case protagonists.'], answer: 'B' },
            { id: 7, text: 'Which of the following is an advantage of primary research?', options: ['It is generally less expensive than secondary research.', 'It provides data specifically tailored to the research question.', 'It is quicker to conduct than secondary research.', 'It always provides a larger sample size.'], answer: 'B' },
            { id: 8, text: 'Research that focuses on numerical data and statistical analysis to test hypotheses is called:', options: ['Qualitative research', 'Exploratory research', 'Quantitative research', 'Descriptive research'], answer: 'C' },
            { id: 9, text: 'A structured conversation where a researcher asks questions to gather information from a respondent is called an:', options: ['Experiment', 'Survey', 'Interview', 'Focus Group'], answer: 'C' },
            { id: 10, text: 'The first step in any research process is typically:', options: ['Collecting data', 'Analyzing data', 'Defining the research problem', 'Drawing conclusions'], answer: 'C' },
        ]
    },
    {
        id: 4, title: 'Data Handling & Tools Awareness', shortTitle: 'Data', icon: '📈', color: 'orange',
        questions: [
            { id: 1, text: 'In MS Excel, which feature allows you to highlight cells that meet specific criteria, such as values greater than a certain number?', options: ['Data Validation', 'Conditional Formatting', 'Sparklines', 'Goal Seek'], answer: 'B' },
            { id: 2, text: 'The process of identifying and correcting errors, inconsistencies, and inaccuracies in data to improve its quality is known as:', options: ['Data mining', 'Data warehousing', 'Data cleaning', 'Data encryption'], answer: 'C' },
            { id: 3, text: 'Which type of chart is best suited for showing the proportion of different categories within a whole?', options: ['Line chart', 'Bar chart', 'Pie chart', 'Scatter plot'], answer: 'C' },
            { id: 4, text: 'Power BI is a business analytics service. What is its primary function?', options: ['Word processing', 'Data entry and storage', 'Data visualization and business intelligence', 'Software development'], answer: 'C' },
            { id: 5, text: 'To display only the sales data for a specific region in an Excel spreadsheet, you would use:', options: ['Sorting', 'Filtering', 'PivotTable', 'Data Validation'], answer: 'B' },
            { id: 6, text: 'What is a common issue encountered during data collection that refers to missing values in a dataset?', options: ['Outliers', 'Duplicates', 'Incomplete data', 'Inconsistent data'], answer: 'C' },
            { id: 7, text: 'Arranging data in a logical order, such as alphabetically or numerically, is called:', options: ['Filtering', 'Sorting', 'Grouping', 'Validating'], answer: 'B' },
            { id: 8, text: 'A powerful Excel tool that summarizes and reorganizes selected columns and rows of data to obtain desired reports is called a:', options: ['Macro', 'Chart', 'PivotTable', 'Formula'], answer: 'C' },
            { id: 9, text: "What does the term 'data integrity' refer to?", options: ['The speed at which data can be processed.', 'The accuracy, consistency, and reliability of data.', 'The amount of data stored.', 'The security measures protecting data.'], answer: 'B' },
            { id: 10, text: 'Tableau is a popular tool primarily used for:', options: ['Database management', 'Statistical programming', 'Data visualization and business intelligence', 'Web development'], answer: 'C' },
        ]
    },
    {
        id: 5, title: 'Logical & Critical Thinking', shortTitle: 'Logical', icon: '🧠', color: 'pink',
        questions: [
            { id: 1, text: 'A company notices a sudden increase in customer complaints about a product. What is the most critical first step?', options: ['Immediately discontinue the product.', 'Launch a new marketing campaign to distract customers.', 'Investigate the root cause of the complaints.', 'Offer discounts to appease customers.'], answer: 'C' },
            { id: 2, text: 'You are leading a team and a project is falling behind schedule. What is the critical thinking approach?', options: ['Blame individual team members for the delay.', 'Analyze the project plan, identify bottlenecks, and reallocate resources or adjust timelines.', 'Ignore the delay and hope it resolves itself.', 'Work overtime without analyzing the cause.'], answer: 'B' },
            { id: 3, text: 'The ability to objectively analyze and evaluate information in order to form a judgment is known as:', options: ['Creative thinking', 'Critical thinking', 'Intuitive thinking', 'Emotional thinking'], answer: 'B' },
            { id: 4, text: 'In a complex decision-making process, what is the benefit of brainstorming multiple solutions?', options: ['It prolongs the decision-making time unnecessarily.', 'It ensures that all possible angles and innovative approaches are considered.', 'It often leads to confusion and indecision.', 'It is only useful for simple problems.'], answer: 'B' },
            { id: 5, text: 'Before launching a new product, a company should critically assess:', options: ["The CEO's favorite color.", 'The market demand, competitive landscape, and potential risks.', 'The office decor.', 'The number of social media followers.'], answer: 'B' },
            { id: 6, text: 'Which of the following is a key characteristic of effective problem-solving?', options: ['Jumping to conclusions quickly.', 'Systematically breaking down the problem into smaller, manageable parts.', 'Avoiding collaboration with others.', 'Relying solely on past experiences without adapting.'], answer: 'B' },
            { id: 7, text: 'A marketing campaign generates a lot of website traffic, but visitors are not making purchases. What critical insight can be drawn?', options: ['The product is too cheap.', 'The website user experience or product offering might not be meeting visitor expectations.', 'The advertising budget is too low.', 'The campaign is a complete failure.'], answer: 'B' },
            { id: 8, text: 'What is the term for a cognitive bias where people overemphasize the first piece of information they receive?', options: ['Confirmation bias', 'Availability heuristic', 'Anchoring bias', 'Framing effect'], answer: 'C' },
            { id: 9, text: 'When evaluating different strategies, a critical thinker would:', options: ['Choose the strategy that is easiest to implement.', "Assess each strategy's potential outcomes, feasibility, and alignment with objectives.", 'Select the strategy recommended by the most senior person.', 'Avoid making a decision until all uncertainties are eliminated.'], answer: 'B' },
            { id: 10, text: 'The ability to identify assumptions, evaluate evidence, and recognize logical connections is central to:', options: ['Memorization', 'Creative writing', 'Critical thinking', 'Emotional intelligence'], answer: 'C' },
        ]
    },
    {
        id: 6, title: 'General Awareness & Communication', shortTitle: 'General', icon: '🌐', color: 'teal',
        questions: [
            { id: 1, text: 'Which emerging technology is revolutionizing data security and decentralized transactions?', options: ['Artificial Intelligence (AI)', 'Internet of Things (IoT)', 'Virtual Reality (VR)', 'Blockchain'], answer: 'D' },
            { id: 2, text: 'A company that is privately held and valued at over $1 billion is commonly referred to as a:', options: ['Blue Chip company', 'Unicorn startup', 'Fortune 500 company', 'Publicly traded company'], answer: 'B' },
            { id: 3, text: 'The use of social media platforms, search engines, and email to reach target audiences is characteristic of:', options: ['Traditional marketing', 'Digital marketing', 'Direct marketing', 'Guerrilla marketing'], answer: 'B' },
            { id: 4, text: 'Analyzing the strengths, weaknesses, opportunities, and threats of rival companies is part of:', options: ['Internal analysis', 'Competitor analysis', 'Customer segmentation', 'Product positioning'], answer: 'B' },
            { id: 5, text: 'The increasing integration of online and offline shopping experiences by retailers is known as:', options: ['E-commerce', 'Brick-and-mortar retail', 'Omnichannel retail', 'Direct-to-consumer (D2C)'], answer: 'C' },
            { id: 6, text: 'When writing a professional email, what is the most appropriate salutation?', options: ['Hey [Name],', 'To Whom It May Concern,', 'Dear [Mr./Ms./Mx. Last Name],', 'Yo [Name],'], answer: 'C' },
            { id: 7, text: 'The main objective of summarizing a lengthy report is to:', options: ['Include every detail from the original report.', 'Provide a concise overview of the key findings, conclusions, and recommendations.', 'Make the report longer and more complex.', "Express personal opinions about the report's content."], answer: 'B' },
            { id: 8, text: 'In a formal business report, the section that provides background information and context is typically the:', options: ['Executive Summary', 'Introduction', 'Conclusion', 'Recommendations'], answer: 'B' },
            { id: 9, text: 'Which of the following is a barrier to effective communication?', options: ['Active listening', 'Clear articulation', 'Jargon and technical terms used with a general audience', 'Empathy'], answer: 'C' },
            { id: 10, text: 'When presenting complex data, what communication technique is most effective?', options: ['Reading out raw numbers without explanation.', 'Using clear visuals (charts, graphs) and explaining their implications.', 'Avoiding any visual aids.', 'Speaking quickly to cover more information.'], answer: 'B' },
        ]
    },
]

const OPTION_KEYS = ['A', 'B', 'C', 'D']
const sectionColors: Record<string, { bg: string; text: string; border: string; active: string }> = {
    blue: { bg: 'bg-blue-600', text: 'text-blue-300', border: 'border-blue-500', active: 'bg-blue-600/80' },
    emerald: { bg: 'bg-emerald-600', text: 'text-emerald-300', border: 'border-emerald-500', active: 'bg-emerald-600/80' },
    purple: { bg: 'bg-purple-600', text: 'text-purple-300', border: 'border-purple-500', active: 'bg-purple-600/80' },
    orange: { bg: 'bg-orange-600', text: 'text-orange-300', border: 'border-orange-500', active: 'bg-orange-500/80' },
    pink: { bg: 'bg-pink-600', text: 'text-pink-300', border: 'border-pink-500', active: 'bg-pink-600/80' },
    teal: { bg: 'bg-teal-600', text: 'text-teal-300', border: 'border-teal-500', active: 'bg-teal-600/80' },
}

type Phase = 'id-entry' | 'countdown' | 'test' | 'submitted'
type Answers = Record<string, string>
type Visited = Record<string, boolean>

const BG_DESKTOP = "url('/backgroud_image.jpg')"
const BG_MOBILE = "url('/mobile_bg.png')"

// ─── Background ───────────────────────────────────────────────────────────────
function Bg({ blur }: { blur?: boolean }) {
    return (
        <>
            <div
                className="pointer-events-none fixed inset-0 -z-10 bg-cover bg-center hidden md:block"
                style={{ backgroundImage: BG_DESKTOP }}
            />
            <div
                className="pointer-events-none fixed inset-0 -z-10 bg-cover bg-center md:hidden"
                style={{ backgroundImage: BG_MOBILE }}
            />
            <div className={`pointer-events-none fixed inset-0 -z-10 transition-all duration-700 ${blur ? 'bg-slate-900/80 backdrop-blur-lg' : 'bg-slate-900/70'}`} />
        </>
    )
}

export default function MbaTestPage() {
    const router = useRouter()
    const [phase, setPhase] = useState<Phase>('id-entry')
    const [candidateId, setCandidateId] = useState('')
    const [idError, setIdError] = useState('')
    const [countdown, setCountdown] = useState(90)
    const [activeSectionIdx, setActiveSectionIdx] = useState(0)
    const [activeQIdx, setActiveQIdx] = useState(0)
    const [answers, setAnswers] = useState<Answers>({})
    const [visited, setVisited] = useState<Visited>({})
    const [timeLeft, setTimeLeft] = useState(90 * 60)
    const [sidebarOpen, setSidebarOpen] = useState(true)
    const [showConfirm, setShowConfirm] = useState(false)

    const section = sections[activeSectionIdx]
    const question = section.questions[activeQIdx]
    const qKey = `${section.id}-${question.id}`
    const totalQ = sections.reduce((a, s) => a + s.questions.length, 0)
    const answeredCount = Object.keys(answers).length

    // Countdown timer (pre-test)
    useEffect(() => {
        if (phase !== 'countdown') return
        if (countdown <= 0) { setPhase('test'); return }
        const t = setTimeout(() => setCountdown(p => p - 1), 1000)
        return () => clearTimeout(t)
    }, [phase, countdown])

    // Main test timer
    useEffect(() => {
        if (phase !== 'test') return
        if (timeLeft <= 0) { finalSubmit(); return }
        const t = setInterval(() => setTimeLeft(p => Math.max(p - 1, 0)), 1000)
        return () => clearInterval(t)
    }, [phase, timeLeft])

    // Mark visited
    useEffect(() => {
        if (phase !== 'test') return
        setVisited(prev => ({ ...prev, [qKey]: true }))
    }, [activeSectionIdx, activeQIdx, phase])

    const formatTime = (s: number) => `${String(Math.floor(s / 60)).padStart(2, '0')}:${String(s % 60).padStart(2, '0')}`

    // ── ID Validation & Start ───────────────────────────────────────────────────
    const handleStart = () => {
        const id = candidateId.trim().toUpperCase()
        if (!VALID_IDS.includes(id)) {
            setIdError('Invalid Candidate ID. Valid range: MBA_26_001 – MBA_26_010')
            return
        }
        const completed: string[] = JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]')
        if (completed.includes(id)) {
            setIdError('This Candidate ID has already been used to take this test.')
            return
        }
        setIdError('')
        setCandidateId(id)
        setPhase('countdown')
    }

    // ── Final Submit ────────────────────────────────────────────────────────────
    const finalSubmit = () => {
        const completed: string[] = JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]')
        if (!completed.includes(candidateId)) {
            completed.push(candidateId)
            localStorage.setItem(STORAGE_KEY, JSON.stringify(completed))
        }

        // Compute per-section scores
        const sectionResults = sections.map(sec => {
            const attended = sec.questions.filter(q => answers[`${sec.id}-${q.id}`]).length
            const correct = sec.questions.filter(q => answers[`${sec.id}-${q.id}`] === q.answer).length
            return { section: sec.title, shortTitle: sec.shortTitle, icon: sec.icon, color: sec.color, attended, correct, total: sec.questions.length }
        })
        const totalScore = sectionResults.reduce((a, s) => a + s.correct, 0)

        const results = JSON.parse(localStorage.getItem(RESULTS_KEY) || '[]')
        results.push({ candidateId, date: new Date().toISOString(), totalScore, totalQ, sectionResults })
        localStorage.setItem(RESULTS_KEY, JSON.stringify(results))

        setShowConfirm(false)
        setPhase('submitted')
    }

    const getQStatus = (sIdx: number, qId: number) => {
        const k = `${sections[sIdx].id}-${qId}`
        if (answers[k]) return 'answered'
        if (visited[k]) return 'visited'
        return 'unvisited'
    }

    const nextQuestion = () => {
        if (activeQIdx < section.questions.length - 1) setActiveQIdx(activeQIdx + 1)
        else if (activeSectionIdx < sections.length - 1) { setActiveSectionIdx(activeSectionIdx + 1); setActiveQIdx(0) }
    }
    const prevQuestion = () => {
        if (activeQIdx > 0) setActiveQIdx(activeQIdx - 1)
        else if (activeSectionIdx > 0) { setActiveSectionIdx(activeSectionIdx - 1); setActiveQIdx(sections[activeSectionIdx - 1].questions.length - 1) }
    }

    // ══════════════════════════════════════════════════════════════════════════════
    // PHASE: ID ENTRY
    // ══════════════════════════════════════════════════════════════════════════════
    if (phase === 'id-entry') {
        return (
            <main className="h-screen flex items-center justify-center relative overflow-hidden">
                <Bg />
                <div className="w-full max-w-md px-4">
                    <div className="rounded-3xl bg-slate-900/80 backdrop-blur-xl border border-white/20 shadow-2xl p-8 text-center">
                        <div className="w-16 h-16 bg-blue-500/20 border border-blue-400/30 rounded-2xl flex items-center justify-center mx-auto mb-5">
                            <span className="text-3xl">🎓</span>
                        </div>
                        <h1 className="text-2xl font-extrabold text-white mb-1">MBA Trainee Assessment</h1>
                        <p className="text-slate-400 text-sm mb-6">Enter your Candidate ID to begin. Each ID can only be used once.</p>

                        <div className="text-left mb-4">
                            <label className="block text-xs font-black text-slate-300 uppercase tracking-widest mb-2">Candidate ID</label>
                            <input
                                type="text"
                                value={candidateId}
                                onChange={e => { setCandidateId(e.target.value.toUpperCase()); setIdError('') }}
                                onKeyDown={e => e.key === 'Enter' && handleStart()}
                                placeholder="e.g. MBA_26_001"
                                className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder:text-slate-500 font-mono font-bold text-center text-lg focus:border-blue-400 focus:ring-2 focus:ring-blue-500/20 outline-none transition-all"
                            />
                            {idError && (
                                <div className="mt-2 flex items-start gap-2 p-3 bg-red-500/10 border border-red-500/30 rounded-xl">
                                    <AlertTriangle className="w-4 h-4 text-red-400 shrink-0 mt-0.5" />
                                    <p className="text-red-300 text-xs font-medium">{idError}</p>
                                </div>
                            )}
                        </div>

                        <div className="mb-6 grid grid-cols-2 gap-2 text-[11px] text-slate-400 bg-white/5 border border-white/10 rounded-xl p-3">
                            <div className="flex items-center gap-1.5"><span className="text-emerald-400">✓</span> 60 questions total</div>
                            <div className="flex items-center gap-1.5"><span className="text-blue-400">✓</span> 6 sections</div>
                            <div className="flex items-center gap-1.5"><span className="text-amber-400">✓</span> 90 min duration</div>
                            <div className="flex items-center gap-1.5"><span className="text-red-400">✓</span> One attempt only</div>
                        </div>

                        <button
                            onClick={handleStart}
                            className="w-full py-3.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-base shadow-xl shadow-blue-500/20 transition-all active:scale-95"
                        >
                            🚀 Start Test
                        </button>
                        <button onClick={() => router.push('/assessments')} className="mt-3 text-slate-500 hover:text-slate-300 text-sm transition-colors">
                            ← Back to Assessments
                        </button>
                    </div>
                </div>
            </main>
        )
    }

    // ══════════════════════════════════════════════════════════════════════════════
    // PHASE: COUNTDOWN
    // ══════════════════════════════════════════════════════════════════════════════
    if (phase === 'countdown') {
        const pct = ((90 - countdown) / 90) * 100
        const radius = 70
        const circ = 2 * Math.PI * radius
        const dash = circ * (1 - countdown / 90)
        return (
            <main className="h-screen flex items-center justify-center relative overflow-hidden">
                <Bg blur />
                {/* Blurred test preview below */}
                <div className="fixed inset-0 -z-5 flex flex-col opacity-20 blur-sm pointer-events-none select-none">
                    <div className="h-12 bg-slate-900/80" />
                    <div className="flex-1 flex">
                        <div className="flex-1 p-8">
                            <div className="h-8 w-64 bg-white/10 rounded-full mb-4" />
                            <div className="h-32 bg-white/5 rounded-2xl mb-4" />
                            <div className="space-y-2">{[1, 2, 3, 4].map(i => <div key={i} className="h-12 bg-white/5 rounded-xl" />)}</div>
                        </div>
                        <div className="w-72 bg-slate-900/40" />
                    </div>
                </div>
                {/* Countdown card */}
                <div className="relative z-10 flex flex-col items-center text-center px-4">
                    <p className="text-white/80 font-bold text-sm mb-6 uppercase tracking-widest">Test Starting In</p>
                    <div className="relative w-48 h-48 mb-6">
                        <svg className="w-full h-full -rotate-90" viewBox="0 0 160 160">
                            <circle cx="80" cy="80" r={radius} stroke="rgba(255,255,255,0.1)" strokeWidth="8" fill="none" />
                            <circle
                                cx="80" cy="80" r={radius}
                                stroke="#3b82f6" strokeWidth="8" fill="none"
                                strokeDasharray={circ}
                                strokeDashoffset={circ - dash}
                                strokeLinecap="round"
                                style={{ transition: 'stroke-dashoffset 1s linear' }}
                            />
                        </svg>
                        <div className="absolute inset-0 flex flex-col items-center justify-center">
                            <span className="text-7xl font-black text-white leading-none">{countdown}</span>
                            <span className="text-xs text-slate-400 uppercase tracking-widest mt-1">seconds</span>
                        </div>
                    </div>
                    <div className="bg-slate-900/70 backdrop-blur border border-white/10 rounded-2xl px-6 py-4 space-y-1.5 text-sm text-slate-300">
                        <p className="font-semibold text-white">🆔 Candidate: <span className="text-blue-300 font-mono">{candidateId}</span></p>
                        <p>Get ready — the test will begin automatically.</p>
                        <p className="text-xs text-slate-500">Ensure a stable internet connection before starting.</p>
                    </div>
                </div>
            </main>
        )
    }

    // ══════════════════════════════════════════════════════════════════════════════
    // PHASE: SUBMITTED / RESULTS
    // ══════════════════════════════════════════════════════════════════════════════
    if (phase === 'submitted') {
        const results = JSON.parse(localStorage.getItem(RESULTS_KEY) || '[]')
        const myResult = results.find((r: any) => r.candidateId === candidateId) || {}
        const sectionResults = myResult.sectionResults || []
        const totalScore = myResult.totalScore ?? 0
        return (
            <main className="min-h-screen flex items-center justify-center relative overflow-hidden py-8">
                <Bg />
                <div className="w-full max-w-2xl px-4">
                    <div className="rounded-3xl bg-slate-900/80 backdrop-blur-xl border border-white/20 shadow-2xl p-8">
                        <div className="text-center mb-8">
                            <div className="w-20 h-20 bg-emerald-500/20 border border-emerald-400/40 rounded-full flex items-center justify-center mx-auto mb-4">
                                <CheckCircle className="w-10 h-10 text-emerald-300" />
                            </div>
                            <h1 className="text-3xl font-extrabold text-white mb-1">Test Submitted!</h1>
                            <p className="text-slate-400 text-sm">Candidate: <span className="text-blue-300 font-mono font-bold">{candidateId}</span></p>
                        </div>

                        <div className="grid grid-cols-3 gap-3 mb-6">
                            <div className="bg-white/5 border border-white/10 rounded-2xl p-4 text-center">
                                <p className="text-4xl font-black text-white">{totalScore}</p>
                                <p className="text-[10px] text-slate-400 uppercase tracking-widest mt-1">Score</p>
                            </div>
                            <div className="bg-white/5 border border-white/10 rounded-2xl p-4 text-center">
                                <p className="text-4xl font-black text-white">{totalQ}</p>
                                <p className="text-[10px] text-slate-400 uppercase tracking-widest mt-1">Total</p>
                            </div>
                            <div className="bg-white/5 border border-white/10 rounded-2xl p-4 text-center">
                                <p className="text-4xl font-black text-emerald-300">{Math.round((totalScore / totalQ) * 100)}%</p>
                                <p className="text-[10px] text-slate-400 uppercase tracking-widest mt-1">Accuracy</p>
                            </div>
                        </div>

                        <div className="space-y-2 mb-6">
                            {sectionResults.map((sr: any, i: number) => {
                                const c = sectionColors[sr.color]
                                const pct = Math.round((sr.correct / sr.total) * 100)
                                return (
                                    <div key={i} className="flex items-center gap-3 bg-white/5 border border-white/10 rounded-xl p-3">
                                        <span className="text-xl">{sr.icon}</span>
                                        <div className="flex-1 min-w-0">
                                            <div className="flex justify-between items-center mb-1">
                                                <span className="text-sm text-white font-bold truncate">{sr.shortTitle}</span>
                                                <span className={`text-xs font-black ml-2 ${c.text}`}>{sr.correct}/{sr.total}</span>
                                            </div>
                                            <div className="h-1 bg-white/10 rounded-full overflow-hidden">
                                                <div className={`h-full rounded-full ${c.bg}`} style={{ width: `${pct}%` }} />
                                            </div>
                                        </div>
                                        <span className="text-xs text-slate-500 shrink-0">{sr.attended} attempted</span>
                                    </div>
                                )
                            })}
                        </div>

                        <button onClick={() => router.push('/assessments')} className="w-full py-3 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold transition-all">
                            Back to Assessments
                        </button>
                    </div>
                </div>
            </main>
        )
    }

    // ══════════════════════════════════════════════════════════════════════════════
    // PHASE: TEST
    // ══════════════════════════════════════════════════════════════════════════════
    return (
        <main className="h-screen relative overflow-hidden flex flex-col">
            <Bg />

            {/* ── Confirm Submit Popup ─────────────────────────────────────────── */}
            {showConfirm && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/70 backdrop-blur-sm p-4">
                    <div className="w-full max-w-lg bg-slate-900/95 border border-white/20 rounded-3xl shadow-2xl p-6 animate-in fade-in zoom-in-95 duration-200">
                        <div className="flex items-center justify-between mb-4">
                            <h2 className="text-lg font-extrabold text-white">Confirm Submission</h2>
                            <button onClick={() => setShowConfirm(false)} className="w-7 h-7 rounded-full bg-white/10 flex items-center justify-center text-slate-400 hover:text-white">
                                <X className="w-4 h-4" />
                            </button>
                        </div>
                        <p className="text-slate-400 text-sm mb-4">Review your answers before submitting. Once submitted, you cannot retake this test.</p>
                        <div className="space-y-2 mb-5">
                            {sections.map(sec => {
                                const c = sectionColors[sec.color]
                                const attended = sec.questions.filter(q => answers[`${sec.id}-${q.id}`]).length
                                const unanswered = sec.questions.length - attended
                                return (
                                    <div key={sec.id} className="flex items-center gap-2 bg-white/5 border border-white/10 rounded-xl px-3 py-2">
                                        <span>{sec.icon}</span>
                                        <span className="text-sm text-white font-medium flex-1">{sec.shortTitle}</span>
                                        <span className="text-xs text-emerald-400 font-black">{attended} answered</span>
                                        {unanswered > 0 && <span className="text-xs text-red-400 font-medium">{unanswered} skipped</span>}
                                    </div>
                                )
                            })}
                            <div className="flex items-center justify-between bg-blue-600/10 border border-blue-500/30 rounded-xl px-3 py-2">
                                <span className="text-sm font-bold text-white">Total</span>
                                <span className="text-sm font-black text-blue-300">{answeredCount}/{totalQ} answered</span>
                            </div>
                        </div>
                        <div className="flex gap-3">
                            <button onClick={() => setShowConfirm(false)} className="flex-1 py-2.5 rounded-xl bg-white/10 hover:bg-white/20 text-white font-bold text-sm transition-all border border-white/20">
                                Continue Test
                            </button>
                            <button onClick={finalSubmit} className="flex-1 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-sm shadow-lg shadow-emerald-500/20 transition-all">
                                ✓ Confirm Submit
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* ── Top Bar ──────────────────────────────────────────────────── */}
            <header className="shrink-0 z-30 flex items-center justify-between px-4 sm:px-6 py-3 bg-slate-900/80 backdrop-blur-xl border-b border-white/10 shadow-lg">
                <div className="flex items-center gap-3">
                    <button onClick={() => router.push('/assessments')} className="text-slate-400 hover:text-white transition-colors">
                        <ChevronLeft className="w-5 h-5" />
                    </button>
                    <div>
                        <h1 className="text-sm font-extrabold text-white leading-none">MBA Trainee</h1>
                        <p className="text-[10px] text-blue-300 font-mono mt-0.5">{candidateId}</p>
                    </div>
                </div>
                <div className={`flex items-center gap-2 px-4 py-2 rounded-full font-black text-sm transition-colors ${timeLeft < 300 ? 'bg-red-500/20 text-red-300 border border-red-500/40 animate-pulse' : 'bg-white/10 text-white border border-white/20'}`}>
                    <Clock className="w-4 h-4" />
                    {formatTime(timeLeft)}
                </div>
                <button
                    onClick={() => setShowConfirm(true)}
                    className="flex items-center gap-2 px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-sm rounded-xl shadow-lg shadow-emerald-500/20 transition-all"
                >
                    <Send className="w-4 h-4" />
                    Submit
                </button>
            </header>

            {/* ── Section Tabs ────────────────────────────────────────────── */}
            <div className="shrink-0 z-20 flex overflow-x-auto [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none] gap-1 px-3 py-2 bg-slate-900/60 backdrop-blur border-b border-white/10">
                {sections.map((sec, idx) => {
                    const c = sectionColors[sec.color]
                    const isActive = idx === activeSectionIdx
                    const secAnswered = sec.questions.filter(q => answers[`${sec.id}-${q.id}`]).length
                    return (
                        <button
                            key={sec.id}
                            onClick={() => { setActiveSectionIdx(idx); setActiveQIdx(0) }}
                            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold whitespace-nowrap transition-all shrink-0 border ${isActive ? `${c.active} text-white ${c.border}` : 'bg-white/5 text-slate-400 border-white/10 hover:bg-white/10 hover:text-white'}`}
                        >
                            <span>{sec.icon}</span>
                            <span>{sec.shortTitle}</span>
                            <span className={`ml-1 text-[10px] font-black px-1.5 py-0.5 rounded-full ${isActive ? 'bg-white/20 text-white' : 'bg-white/10 text-slate-400'}`}>
                                {secAnswered}/{sec.questions.length}
                            </span>
                        </button>
                    )
                })}
            </div>

            {/* ── Main Layout ─────────────────────────────────────────────── */}
            <div className="flex flex-1 overflow-hidden relative">
                {/* Question area */}
                <div className="flex-1 overflow-y-auto p-4 sm:p-6">
                    <div className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest mb-4 border ${sectionColors[section.color].active} ${sectionColors[section.color].border} text-white`}>
                        {section.icon} {section.title}
                    </div>
                    <div className="rounded-3xl bg-slate-900/70 backdrop-blur-xl border border-white/20 shadow-2xl p-5 sm:p-7 mb-4">
                        <div className="flex items-start gap-4 mb-5">
                            <div className={`shrink-0 w-9 h-9 rounded-full flex items-center justify-center font-black text-sm text-white ${sectionColors[section.color].bg}`}>
                                {activeQIdx + 1}
                            </div>
                            <h2 className="text-base sm:text-lg font-bold text-white leading-relaxed">{question.text}</h2>
                        </div>
                        <div className="space-y-2.5">
                            {question.options.map((opt, i) => {
                                const key = OPTION_KEYS[i]
                                const isSelected = answers[qKey] === key
                                return (
                                    <button
                                        key={key}
                                        onClick={() => setAnswers(prev => ({ ...prev, [qKey]: key }))}
                                        className={`w-full flex items-center gap-4 p-4 rounded-2xl border-2 text-left transition-all duration-200 group ${isSelected ? 'border-blue-500 bg-blue-600/20 shadow-lg shadow-blue-500/10' : 'border-white/10 bg-white/5 hover:border-white/30 hover:bg-white/10'}`}
                                    >
                                        <span className={`shrink-0 w-8 h-8 rounded-full flex items-center justify-center text-sm font-black border-2 transition-all ${isSelected ? 'bg-blue-600 border-blue-400 text-white' : 'border-white/20 text-slate-400 group-hover:border-white/40 group-hover:text-white'}`}>{key}</span>
                                        <span className={`text-sm font-medium leading-relaxed ${isSelected ? 'text-white' : 'text-slate-300 group-hover:text-white'}`}>{opt}</span>
                                        {isSelected && <CheckCircle className="ml-auto shrink-0 w-5 h-5 text-blue-400" />}
                                    </button>
                                )
                            })}
                        </div>
                    </div>
                    <div className="flex items-center justify-between gap-3">
                        <button onClick={prevQuestion} disabled={activeSectionIdx === 0 && activeQIdx === 0} className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-white/10 hover:bg-white/20 text-white text-sm font-bold border border-white/20 disabled:opacity-30 disabled:cursor-not-allowed transition-all">
                            <ChevronLeft className="w-4 h-4" /> Previous
                        </button>
                        <span className="text-xs text-slate-400 font-medium">{answeredCount}/{totalQ} answered</span>
                        <button onClick={nextQuestion} disabled={activeSectionIdx === sections.length - 1 && activeQIdx === section.questions.length - 1} className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-sm font-bold shadow-md shadow-blue-500/20 disabled:opacity-30 disabled:cursor-not-allowed transition-all">
                            Next <ChevronRight className="w-4 h-4" />
                        </button>
                    </div>
                </div>

                {/* Sidebar */}
                <aside className={`relative shrink-0 transition-all duration-300 hidden md:flex flex-col ${sidebarOpen ? 'w-96' : 'w-0'} overflow-hidden bg-slate-900/90 backdrop-blur-xl border-l border-white/10`}>
                    <button onClick={() => setSidebarOpen(p => !p)} className="hidden md:block absolute -left-7 top-1/2 -translate-y-1/2 z-50 bg-slate-800 border border-white/10 rounded-l-lg p-1 text-slate-400 hover:text-white transition-all">
                        {sidebarOpen ? <ChevronRight className="w-4 h-4" /> : <ChevronLeft className="w-4 h-4" />}
                    </button>
                    <div className="p-3 border-b border-white/10">
                        <p className="text-[10px] font-black text-white uppercase tracking-widest mb-2">Question Tracker</p>
                        <div className="flex gap-3 text-[9px] text-slate-400">
                            <div className="flex items-center gap-1"><span className="w-2.5 h-2.5 rounded bg-white/10 border border-white/20 shrink-0" /> Not visited</div>
                            <div className="flex items-center gap-1"><span className="w-2.5 h-2.5 rounded bg-red-500/80 shrink-0" /> Not answered</div>
                            <div className="flex items-center gap-1"><span className="w-2.5 h-2.5 rounded bg-emerald-500/80 shrink-0" /> Answered</div>
                        </div>
                    </div>
                    <div className="overflow-y-auto flex-1 p-2.5 space-y-3">
                        <div className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg border text-[10px] font-black uppercase tracking-widest ${sectionColors[section.color].active} ${sectionColors[section.color].border} text-white`}>
                            <span>{section.icon}</span><span>{section.title}</span>
                        </div>
                        <div>
                            <div className="flex justify-between text-[9px] text-slate-400 mb-1">
                                <span>{section.questions.filter(q => answers[`${section.id}-${q.id}`]).length} answered</span>
                                <span>{section.questions.length} total</span>
                            </div>
                            <div className="h-1 bg-white/10 rounded-full overflow-hidden">
                                <div className={`h-full rounded-full transition-all duration-300 ${sectionColors[section.color].bg}`} style={{ width: `${(section.questions.filter(q => answers[`${section.id}-${q.id}`]).length / section.questions.length) * 100}%` }} />
                            </div>
                        </div>
                        <div className="grid grid-cols-5 gap-1">
                            {section.questions.map((q, qIdx) => {
                                const status = getQStatus(activeSectionIdx, q.id)
                                const isActivQ = qIdx === activeQIdx
                                return (
                                    <button key={q.id} onClick={() => setActiveQIdx(qIdx)} title={`Q${q.id}`}
                                        className={`w-full aspect-square rounded-md flex items-center justify-center text-[10px] font-black transition-all border ${isActivQ ? 'border-blue-400 ring-1 ring-blue-400/40 scale-105 text-white bg-blue-600' : status === 'answered' ? 'bg-emerald-500/80 border-emerald-400/50 text-white hover:scale-105' : status === 'visited' ? 'bg-red-500/70 border-red-400/50 text-white hover:scale-105' : 'bg-white/5 border-white/10 text-slate-500 hover:bg-white/15 hover:text-white hover:scale-105'}`}>
                                        {q.id}
                                    </button>
                                )
                            })}
                        </div>
                        <div className="pt-2 border-t border-white/10">
                            <p className="text-[9px] font-black uppercase tracking-widest text-slate-500 mb-1.5">All Sections</p>
                            <div className="space-y-1">
                                {sections.map((sec, sIdx) => {
                                    const secAnswered = sec.questions.filter(q => answers[`${sec.id}-${q.id}`]).length
                                    const c = sectionColors[sec.color]
                                    const isActiveSec = sIdx === activeSectionIdx
                                    return (
                                        <button key={sec.id} onClick={() => { setActiveSectionIdx(sIdx); setActiveQIdx(0) }}
                                            className={`w-full flex items-center gap-1.5 px-2 py-1 rounded-md text-[10px] font-bold transition-all border ${isActiveSec ? `${c.active} ${c.border} text-white` : 'bg-white/5 border-white/5 text-slate-400 hover:bg-white/10 hover:text-white'}`}>
                                            <span className="text-xs">{sec.icon}</span>
                                            <span className="flex-1 text-left">{sec.shortTitle}</span>
                                            <span className={`font-black text-[9px] ${isActiveSec ? 'text-white' : c.text}`}>{secAnswered}/{sec.questions.length}</span>
                                        </button>
                                    )
                                })}
                            </div>
                        </div>
                    </div>
                    <div className="p-2 border-t border-white/10 grid grid-cols-2 gap-1.5 text-center">
                        <div className="bg-emerald-500/10 border border-emerald-500/30 rounded-lg p-1.5">
                            <p className="text-lg font-black text-emerald-300">{answeredCount}</p>
                            <p className="text-[9px] text-emerald-400 uppercase tracking-widest">Answered</p>
                        </div>
                        <div className="bg-red-500/10 border border-red-500/30 rounded-lg p-1.5">
                            <p className="text-lg font-black text-red-300">{totalQ - answeredCount}</p>
                            <p className="text-[9px] text-red-400 uppercase tracking-widest">Remaining</p>
                        </div>
                    </div>
                </aside>

                {!sidebarOpen && (
                    <button onClick={() => setSidebarOpen(true)} className="hidden md:block absolute right-0 top-1/2 -translate-y-1/2 z-50 bg-slate-800 border border-white/10 rounded-l-lg p-1.5 text-slate-400 hover:text-white transition-all shadow-lg">
                        <ChevronLeft className="w-4 h-4" />
                    </button>
                )}
            </div>
        </main>
    )
}
