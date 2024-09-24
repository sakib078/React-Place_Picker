export default function ErrorPage({ error = "ERROR", message , onConfirm}) {
    return (
       <div className="error">
           <h2> {error}</h2>
           <p> {message} </p>
           {
             onConfirm && (<div id="confirmation-actions">
             <button onClick={onConfirm} className="button"> Okay </button>
            </div>)
           }
      </div>

    );
  }
  