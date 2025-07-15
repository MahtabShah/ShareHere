import web_img from "/src/assets/Screenshot 2025-07-01 130410.png";
import post_img1 from "/src/assets/Screenshot 2025-07-01 185041.png";
import post_img2 from "/src/assets/Screenshot 2025-07-01 185137.png";
import { FaArrowRight } from "react-icons/fa";
import { useQuote } from "../context/QueotrContext";
import VoicePost from "./VoicePost";

const Explore = () => {
  const { sm_break_point } = useQuote();
  return (
    <div className="mt-5 pt-4 p-2 d-flex flex-column align-items-center justify-content-center">
      <VoicePost />
      {/* <section className="d-">
        <div className="text-center mb-4">
          <h2 className="fw-bold">Explore Our Platform</h2>
          <p className="text-muted">
            Discover the features and values that make our website special.
          </p>
        </div>
        <div className="w-100">
          <h5>First Insight & Looking Style</h5>
          <p>
            Vibe Ink is a creative digital platform designed to bring ideas to
            life. Whether you're a developer, designer, writer, or thinker, Vibe
            Ink is your space to explore, express, and evolve. We blend
            technology with creativity to create content that not only informs
            but also inspires. From insightful blogs, coding tutorials, and
            innovative tools to aesthetic UI/UX designs and project showcases,
            Vibe Ink is your companion in the journey of digital expression.
            It’s not just a website – it’s a vibe.
          </p>
        </div>

        <div className="row g-4">
          <div className="col-md-4">
            <div className="card h-100 shadow-sm border-0">
              <div className="card-body text-center">
                <i className="bi bi-globe2 display-5 text-primary mb-3"></i>
                <h5 className="card-title">Global Community</h5>
                <p className="card-text">
                  Connect with people from around the world and share your ideas
                  freely.
                </p>
              </div>
            </div>
          </div>

          <div className="col-md-4">
            <div className="card h-100 shadow-sm border-0">
              <div className="card-body text-center">
                <i className="bi bi-lightbulb display-5 text-warning mb-3"></i>
                <h5 className="card-title">Smart Features</h5>
                <p className="card-text">
                  Enjoy intuitive tools, reporting systems, and personalized
                  experiences.
                </p>
              </div>
            </div>
          </div>

          <div className="col-md-4">
            <div className="card h-100 shadow-sm border-0">
              <div className="card-body text-center">
                <i className="bi bi-shield-lock display-5 text-danger mb-3"></i>
                <h5 className="card-title">Safe & Secure</h5>
                <p className="card-text">
                  Your privacy and safety matter. We protect your data and fight
                  abuse.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section> */}

      {/* <section
        className="p-2 position-relative d-none h-100 w-100"
        style={{ maxWidth: "801px" }}
      >
        <div className="text-center mb-4">
          <h2 className="fw-bold">Explore Our Platform</h2>
          <p className="text-muted">
            Discover the features and values that make our website special.
          </p>
        </div>

        <div className="">
          <h5>First Insight & Looking Style</h5>
          <p>
            Vibe Ink is a creative digital platform designed to bring ideas to
            life. Whether you're a developer, designer, writer, or thinker, Vibe
            Ink is your space to explore, express, and evolve. We blend
            technology with creativity to create content that not only informs
            but also inspires. From insightful blogs, coding tutorials, and
            innovative tools to aesthetic UI/UX designs and project showcases,
            Vibe Ink is your companion in the journey of digital expression.
            It’s not just a website – it’s a vibe.
          </p>
        </div>

        <div className="w-100 d-flex" style={{ aspectRatio: "1/1" }}>
          <div
            className="w-100 bg-none rounded gap-2"
            style={{
              zIndex: "10",
            }}
          >
            <p
              style={{
                fontSize: "clamp(4px , 2.5vw, 1rem)",
              }}
            >
              Lorem ipsum dolor sit amet consectetur adipisicing elit. Expedita
              possimus perferendis, veniam quos sunt labore quibusdam eum unde!
            </p>
            <img
              src={post_img2}
              alt=""
              className="col-md-6 p-2 bg-light rounded-3"
              style={{
                width: "clamp(100px , 56vw, 420px)",
                transform: "translateX(28%)",
              }}
            />
          </div>
          <div className="flex-grow-1 rounded gap-3 position-relative">
            <img
              src={post_img1}
              alt=""
              className="col-md-6 bg-light p-2 rounded-3"
              style={{ width: "clamp(100px , 56vw, 420px)" }}
            />

            <p
              className=""
              style={{
                fontSize: "clamp(4px , 2.5vw, 1rem)",
                transform: "translateX(41%)",
                width: "72%",
              }}
            >
              Lorem ipsum, dolor sit amet consectetur adipisicing elit. Corrupti
              error numquam, pariatur ad explicabo alias assumenda iure facere
            </p>
          </div>
        </div>
      </section> */}
    </div>
  );
};

export default Explore;
