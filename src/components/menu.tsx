import { useState } from "react";
import Discord from "../assets/discord.png";
import Twitter from "../assets/twitter_copy.png";
import RightArrow from "../assets/right_arrow_menu.png";
import "../App.css";

const MenuContent = (props: any) => {
  const [items] = useState(["VAULT", "TEAM", "ALPHA", "STAKE"]);

  return (
    <div className="menu">
      {items.map((i) => (
        <div className="menu-item" key={i}>
          <a
            className="menu-item-inside"
            onClick={() => props.closeCallback(i)}
            target="_blank"
          >
            {i}{" "}
            <span className="right-arrow-menu">
              <img alt="Right-arrow" src={RightArrow} />
            </span>
          </a>
        </div>
      ))}
      <div className="menu-item m-t-15">
        <a
          className="menu-item-inside"
          href="https://secret-alpha.gitbook.io/glitch/"
          target="_blank"
          rel="noreferrer"
          onClick={() => props.closeCallback(1)}
        >
          Whitepaper{" "}
          <span className="right-arrow-menu">
            <img alt="Right-arrow" src={RightArrow} />
          </span>
        </a>
      </div>
      <div className="social-media-mobile">
        <a
          href="https://twitter.com/SecretAlphaLabs"
          target="_blank"
          rel="noreferrer"
          onClick={() => props.closeCallback(1)}
        >
          <img alt="Twitter" className="social-icons-mobile" src={Twitter} />
        </a>
        <a
          href="https://discord.com/invite/SecretAlpha"
          target="_blank"
          rel="noreferrer"
          onClick={() => props.closeCallback(1)}
        >
          <img alt="Discord" className="social-icons-mobile" src={Discord} />
        </a>
      </div>
    </div>
  );
};

export default MenuContent;
