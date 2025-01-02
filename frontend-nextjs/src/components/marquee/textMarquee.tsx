import Marquee from "react-fast-marquee";

interface TextMarqueeProps {
  position: "top" | "bottom";
}

export const TextMarquee = (props: TextMarqueeProps) => {
  return (
    <div
      className={`fixed left-0 bg-red-800/60 py-2 z-50 ${
        props.position + "-0"
      }`}
    >
      <Marquee>
        <p className="text-sm text-white/80 px-2">
          {" "}
          Welcome to our NBA News Search Engine! Created by Team 7 (Glenn,
          Alghi, and Cut Dahliana) for our Information Retrieval project, this
          platform provides comprehensive search capabilities for the NBA news.
          Explore in-depth articles, game insights, player updates, and team
          highlights – all at your fingertips. Dive into the world of
          professional basketball and discover the stories that matter!{" "}
        </p>
      </Marquee>
    </div>
  );
};
