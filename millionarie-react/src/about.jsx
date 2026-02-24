export default function About() { 
    return ( 
        <div style={{ padding: 20, background: "rgba(0,0,0,0.6)", borderRadius: 20, maxWidth: 600, margin: "40px auto", textAlign: "center" }}>
            <h1>About This Game</h1>
            <p>
                This is a React implementation of the popular quiz game "Who Wants to Be a Millionaire"
                built for fun and learning. It features a series of multiple-choice questions with increasing difficulty,
                a timer, and a money counter. The game is designed to be responsive and visually appealing.
            </p>
            <p>
                The questions are hardcoded for demonstration purposes, but you can easily modify the code to fetch
                questions from an API or a database. The game also includes basic styling and animations to enhance the user experience.
            </p>
            <p>
                Feel free to explore the code, customize the questions, and add new features like lifelines or a high score system!
            </p>
        </div>
    )};