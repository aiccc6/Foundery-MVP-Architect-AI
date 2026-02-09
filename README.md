<div align="center">
<img width="1200" height="475" alt="GHBanner" src="https://github.com/user-attachments/assets/0aa67016-6eaf-458a-adb2-6e31a0763ed6" />
</div>

export default function Home() {
  return (
    <main>
      <h1>Run and Deploy Your AI Studio App</h1>

      <div style={{ display: "flex", justifyContent: "center", marginTop: "30px" }}>
        <iframe
          width="900"
          height="500"
          src="[https://www.youtube.com/embed/YOUR_VIDEO_ID](https://youtu.be/KXP1CEOJjUM?si=ZhFd_ikWPLCts1dc)"
          title="AI Studio Project Showcase"
          frameBorder="0"
          allowFullScreen
        ></iframe>
      </div>
    </main>
  );
}


# Run and deploy your AI Studio app

This contains everything you need to run your app locally.

View your app in AI Studio: https://ai.studio/apps/drive/1TY8_jN0VQv-r3jUzTHD4gfisAK3UjI8L

## Run Locally

**Prerequisites:**  Node.js


1. Install dependencies:
   `npm install`
2. Set the `GEMINI_API_KEY` in [.env.local](.env.local) to your Gemini API key
3. Run the app:
   `npm run dev`
