import {BsGithub} from "react-icons/bs"

const footer={
    outerWidth: "100%",
    padding: "100px 0px 0px 0px"
}

const Footer = () => {
    return(
        <footer className="footer" style={footer}>
            <div>
                Please check <a href="https://github.com/SnakeSneakS/interactive-live-streamer"><BsGithub/>snakesneaks</a>
            </div> 
        </footer>
    )
}

export default Footer;