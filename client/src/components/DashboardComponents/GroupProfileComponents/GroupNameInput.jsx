





export const GroupNameInput = ({groupNameCharCount, groupName, handleGroupNameChange}) => {


    return (
        <div className="groupNameInput">
            <input className={'group-name-input'}
                   type={'text'}
                   value={groupName}
                   onChange={e => handleGroupNameChange(e)}
                   onKeyDown={(e) => {
                       if (groupName.length >= 15 && !['Backspace', 'Delete', 'ArrowLeft', 'ArrowRight'].includes(e.key)) {
                           e.preventDefault();
                       }
                   }}
            />
            <p><span>{groupNameCharCount}</span>/15</p>
        </div>
    )
}