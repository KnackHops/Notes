let _DATABASE=[{title: "test", body: "testingminefam", editable: true, id:0}];
let titleInput, bodyInput;
let editable=false;
let clickingCheck=false;
let currentOpen;

const saveNote = () => {
    id = _DATABASE[_DATABASE.length-1].id+1;
    _DATABASE.push({title: titleInput, body: bodyInput, editable, id});
    closeBtnClicked(".noteMenu");
    clearNotes();
    nodeLoad();
}

const deleteNote = id => {
    _DATABASE = _DATABASE.filter(user=>user.id!==Number(id));
    clearNotes();
    nodeLoad();
}

const createNote = (title="Double Click here!", body=null, id=null) => {
    if(!document.querySelector(".mainArticle ul .defaultNote") || id!==null){
    const ul = document.querySelector(".mainArticle ul")
    const li = document.createElement("li");
    const h3 = document.createElement("h3");

    if(title==="Double Click here!" && id){
        title="No Title";
    }else if(title===null && id){
        body=" ";
    }
    h3.textContent = title;
    li.appendChild(h3);
    if(id===null){
        li.classList.add("defaultNote");
        li.addEventListener("dblclick", clicked);
    }else{
        const pBody = document.createElement("p");
        li.setAttribute("id","note"+id);
        pBody.textContent = body;
        li.appendChild(pBody);
        li.classList.add("userNote");
        if(editable){
            li.classList.add("editable");
        }else{
            li.classList.add("nonEditable");
        }
        li.addEventListener("click",e=>{
            if(e.detail===1){
                timer = setTimeout(()=>{
                    clickingCheck=true;
                    clicked(e);
                },200)
            }
        });
        li.addEventListener("dblclick",e=>{
            if(e.detail===2 && !clickingCheck){
                clearTimeout(timer);
                clicked(e);
            }
        })
    }
    li.classList.add("txtCen");
    ul.appendChild(li)
    }
}

const clearNotes = () => {
    const lists = document.querySelectorAll(".mainArticle ul li");

    lists.forEach(list => {
        list.parentNode.removeChild(list);
    })
}

const nodeLoad = () => {
    if(_DATABASE){
        _DATABASE.forEach(item=>{
            createNote(item.title,item.body,item.id);
        })
    }
    createNote();
}

const clicked = e => {
    e.preventDefault();
    let btnClass = e.target.classList[0];
    const parent = e.target.parentNode;
    let nodeClass;

    parent.className === "txtCen" ? nodeClass = ".noteMenu"  : (parent.classList.contains("defaultNote") ? nodeClass = ".noteMenu" : nodeClass = "." + (parent.className.replace("Btn","")));
    
    if(parent.classList.contains("userNote") || btnClass==="userNote" || btnClass==="addBtn"){
        if(btnClass!=="addBtn"){
            btnClass="userNote";
        }
    }

    if(btnClass !== "closeBtn" && btnClass !=="addBtn" && btnClass !=="userNote"){
        if(!document.querySelector("section .emailContainer").classList.contains("hiddenSection")){
            document.querySelector("section .emailContainer").classList.toggle("hiddenSection");
        }
    
        document.querySelectorAll("body section").forEach(section=>{
            if(!section.classList.contains("hiddenSection")){
                closeBtnClicked("."+section.classList[0]);
            }
        });
        menuClicked(nodeClass,e.target.className);
    }else if(btnClass==="addBtn"){
        if(titleInput || bodyInput){
            saveNote();
        }else{
            window.alert("Please Enter a title or a body");
        }
    }else if(btnClass==="userNote"){
        if(e.type==="click"){
            currentOpen=parent.id;
            menuClicked("none",null,currentOpen);
        }else{
            deleteNote(parent.id.replace("note",""));
        }
    }else{
        if(parent.classList.contains("userEdit")){
            closeBtnClicked("."+ parent.classList[0], "aye");
        }else{
            closeBtnClicked("." + parent.classList[0]);
        }
    }
}

const menuClicked = (nodeClass, registerClass=null, userID=false) => {
    if(registerClass==="registerBtn"){
        document.querySelector("section .emailContainer").classList.toggle("hiddenSection");
    }

    if(!userID){
        document.querySelector(nodeClass).classList.toggle("hiddenSection");
    }else{
        const addBtn = document.querySelector(".addBtn");
        addBtn.classList.toggle("addBtn");
        addBtn.classList.toggle("editBtn");
        addBtn.textContent = "Edit";
        _DATABASE.forEach(user=>{
            if(Number(userID.replace("note","")) === user.id){
                if(!user.editable){
                    document.querySelector(".noteMenu input").disabled = true;
                    document.querySelector(".noteMenu textarea").disabled = true;
                    document.querySelector(".noteMenu .extraInput p input").checked = false;
                    addBtn.disabled = true;
                }
            }
        })
        document.querySelector(".noteMenu").classList.toggle("userEdit");
        document.querySelector(".noteMenu").classList.toggle("hiddenSection");
    }
}

const closeBtnClicked = (nodeClass,userEdit) => {
    if(nodeClass===".loginRegisterMenu"){
        if(!document.querySelector("section .emailContainer").classList.contains("hiddenSection")){
            document.querySelector("section .emailContainer").classList.toggle("hiddenSection");
        }
    }
    if(userEdit){
        const addBtn = document.querySelector(".editBtn");
        addBtn.classList.toggle("editBtn");
        addBtn.classList.toggle("addBtn");
        addBtn.textContent = "Add Note";
        document.querySelector(".noteMenu").classList.toggle("userEdit");
    }
    clearInputs(nodeClass);
    document.querySelector(nodeClass).classList.toggle("hiddenSection");
}

const clearInputs = whichNode => {
    if(whichNode===".loginRegisterMenu"){
        document.querySelectorAll(`${whichNode} p input`).forEach(input=>input.value = "");
    }else{
        document.querySelector(`${whichNode} input`).value="";
        document.querySelector(`${whichNode} textarea`).value="";
        document.querySelector(`${whichNode} .extraInput p input`).checked = false;
        titleInput = "";
        bodyInput = "";
        editable = false;
    }
}

window.onload = () =>{
    const sections = document.querySelectorAll("body section");
    const sectionBtns = document.querySelectorAll("section .closeBtn");
    const loginMenuBtn = document.querySelector("ul .loginRegisterMenuBtn .loginBtn");
    const registerMenuBtn = document.querySelector("ul .loginRegisterMenuBtn .registerBtn");
    const registerInput = document.querySelector("section .emailContainer");
    const addBtn = document.querySelector(".noteMenu .extraInput .addBtn");
    const titleBox = document.querySelector(".noteMenu input");
    const bodyBox = document.querySelector(".noteMenu textarea");
    const chckBox = document.querySelector(".noteMenu .extraInput p input");

    registerInput.classList.add("hiddenSection");
    sectionBtns.forEach(btn=>btn.addEventListener("click", clicked));
    sections.forEach(section=>section.classList.add("hiddenSection"));

    const insertInput = e => {
        if(e.target.classList.contains("titleBox")){
            titleInput = e.target.value;
        }else if(e.target.classList.contains("bodyBox")){
            bodyInput = e.target.value;
        }
    }

    nodeLoad();
    loginMenuBtn.addEventListener("click", clicked);
    registerMenuBtn.addEventListener("click", clicked);
    addBtn.addEventListener("click",clicked);
    titleBox.addEventListener("input",insertInput);
    bodyBox.addEventListener("input",insertInput);
    chckBox.addEventListener("change", e=>{
        e.target.checked ? editable = true : editable = false;
    })
}