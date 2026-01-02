function LabelChoice({id,icon,name}){
    let ic
    if(icon){
        ic=<i className={icon}></i>
    }
    let elem=<div id={id} className="label-choices">{icon?ic:null} {name}</div>
    return(
        elem
    )
}

export default LabelChoice
