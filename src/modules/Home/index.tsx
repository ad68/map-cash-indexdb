import { Link } from "react-router-dom";

export default function Index() {
    return <section style={{ width: "200px", padding: "10px", margin: "auto", border: "1px solid silver", borderRadius: "10px" }}>
        <Link to="/map">Map Cash IndexDb</Link>
    </section>
}
