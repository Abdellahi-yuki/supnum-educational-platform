import {MailContext} from '@/assets/pages/Mail/Mail'
import { useContext } from 'react'


function Label({id, icon,name,isSelected}){

    const MailCtx=useContext(MailContext);

    function select(event){
        let selectedId=event.target.id;
        MailCtx.select(Number(selectedId.replace('label-','')))
    }

    return(
        <>
            <div id={id} className={`labels ${isSelected?'selected':'unselected'}`} onClick={(event)=>{select(event)}}>
                <div><i className={icon}></i></div>
                <div className="label-name">{name}</div>
            </div>
        </>
    )

}
export default Label