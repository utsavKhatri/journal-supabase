# ✨ Mindful Moments - A Gratitude Journaling App

<p align="center">
  <img alt="Mindful Moments Application Screenshot" src="/homepage.png" width="700"/>
  <br/>
  <i>A beautiful and intuitive app to cultivate gratitude and mindfulness.</i>
</p>

<p align="center">
  <a href="#-features"><strong>Features</strong></a> ·
  <a href="#-tech-stack"><strong>Tech Stack</strong></a> ·
  <a href="#-getting-started"><strong>Getting Started</strong></a> ·
  <a href="#-deployment"><strong>Deployment</strong></a>
</p>

---

Mindful Moments is a modern, full-stack journaling application designed to help you focus on the positive aspects of your life. With a clean and calming user interface, it provides a space for you to record your thoughts, track your mood, and gain insights into your emotional well-being.

## 🚀 Features

- **✍️ Rich Journaling:** Create, edit, and delete journal entries with a simple and elegant editor.
- **😊 Mood Tracking:** Assign a mood to each entry and visualize your mood distribution over time.
- **📅 Interactive Calendar:** View your journaling activity on an interactive calendar with a heatmap of your entry frequency.
- **📊 Insightful Analytics:** Gain insights into your journaling habits with charts for weekly activity and mood distribution.
- **🎨 Bento Grid Layout:** Your journal entries are beautifully displayed in a dynamic bento grid.
- **🔐 Secure Authentication:** Full authentication flow (sign-up, sign-in, password reset) powered by Supabase Auth.
- **🌙 Light & Dark Mode:** A beautiful and consistent theme that adapts to your system preferences.
- **📥 Data Export:** Export your journal entries to CSV or PDF at any time.
- **🗑️ Account Deletion:** Securely delete your account and all associated data.

<p align="center">
  <img alt="Mindful Moments Insight Page Screenshot" src="/insight.png" width="700"/>
  <br/>
  <i>Gain insights into your emotional well-being with our analytics dashboard.</i>
</p>

## 🛠️ Tech Stack

- **Framework:** [Next.js 15](https://nextjs.org/) (with App Router)
- **Backend & Database:** [Supabase](https://supabase.io/)
- **Styling:** [Tailwind CSS](https://tailwindcss.com/)
- **UI Components:** [shadcn/ui](https://ui.shadcn.com/)
- **Charts:** [Recharts](https://recharts.org/)
- **Package Manager:** [Bun](https://bun.sh/)

## 🏁 Getting Started

To get a local copy up and running, follow these simple steps.

### Prerequisites

- [Bun](https://bun.sh/docs/installation)
- A [Supabase](https://supabase.com/) account and project.

### Installation

1.  **Clone the repository:**
    ```sh
    git clone https://github.com/your-username/journal-supabase.git
    cd journal-supabase
    ```

2.  **Install dependencies:**
    ```sh
    bun install
    ```

3.  **Set up environment variables:**
    Create a `.env.local` file in the root of your project and add your Supabase project URL and anon key:
    ```env
    NEXT_PUBLIC_SUPABASE_URL=your-supabase-project-url
    NEXT_PUBLIC_SUPABASE_PUBLISHABLE_OR_ANON_KEY=your-supabase-anon-key
    ```
    You can find these in your Supabase project's API settings.

4.  **Run the development server:**
    ```sh
    bun dev
    ```

The application should now be running on [http://localhost:3000](http://localhost:3000).

## 🚀 Deployment

This application is ready to be deployed to [Vercel](https://vercel.com/).

1.  **Push your code to a Git repository.**
2.  **Import your project into Vercel.**
3.  **Set up environment variables:**
    Add your Supabase project URL and anon key to the environment variables in your Vercel project settings.
4.  **Deploy!**

Vercel will automatically build and deploy your application.