import logo from "@/../public/supnum-logo.png"

function LogoSupnum() {

    return (
        <div className="logoSupNum">
            <span id="supnum">Sup<div>Num</div></span>
            <img src={logo} alt="Supnum Logo" className="supnum" />
        </div>
    )
}

export default LogoSupnum