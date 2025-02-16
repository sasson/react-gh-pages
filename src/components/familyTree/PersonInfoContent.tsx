import React, {useState, useRef} from 'react';
import ContextManager from '../../utils/ContextManager';
import { PersonData } from '../../types/PersonData';

function PersonInfoContent() {

    const ctx = ContextManager.getInstance().getContext();
    ContextManager.getInstance().addOnSelectedChanged(onPersonChange);
    
    const selectedPerson = ctx.selectedPerson;

    const buttonRef = useRef<HTMLButtonElement>(null);

    const [, setStateCounter] = useState(0);
    
    function onPersonChange() {
        if (buttonRef.current) {
            buttonRef.current.click();
        } else {
            const trigger = document.getElementById("personInfoTrigger");
            if (trigger) {
                trigger.click();
            }
        }
    }

    function refresh() {
        ContextManager.getInstance().upStateCounter();
        const ctx = ContextManager.getInstance().getContext();
        setStateCounter(ctx.stateCounter as number);
    }

    function getNoteLine(note: string): JSX.Element {
		const c = "'";
		let nt = "";
		note = note.replace(c.charAt(0), '^');

		note = note.replace('\r', ' ');
		note = note.replace('\t', ' ');
		note = note.replace('"', '`');
		const st: string[] = note.split('\n');
		for (let i = 0; i < st.length; i++) {
            nt+= " " + st[i].trim();
        }
        nt = nt.replace(/<p>/g, '');
        nt = nt.replace(/<\/p>/g, '');
		nt.trim();
		return <div>{note}</div>;
	}

    function getInfoLine(title: string, content: any): JSX.Element {
        return  (<tr>
                    <td className="person-info-title">{title}</td>
                    <td className="person-info-value">{content}</td>
                </tr>)
    }

    function getPersonInfoSection(data: PersonData): JSX.Element {
        return (
            <table className='person-info-holder'>
                <tbody>
                    {getInfoLine('First Name:', data.firstName)}
                    {getInfoLine('Last Name:', data.surname)}
                    {getInfoLine('Birth:', data.birthDate)}
                    {data.deathDate && getInfoLine('Death:', data.deathDate)}
                    {getInfoLine('Birth Place:', data.birthPlace)}
                    {data.note && getInfoLine('Note:', getNoteLine(data.note))}
                </tbody>
            </table>
        )      
    }

    const data = selectedPerson?.getData();
    if (data && data?.id) {
        return (
            <div className='person-info-content'>
                {getPersonInfoSection(data)}
                <button id="personInfoTrigger" ref={buttonRef} hidden type="button" onClick={refresh} />
            </div>
        )
    } else {
        return (<div></div>);
    }
}

export default PersonInfoContent