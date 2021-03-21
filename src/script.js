let _DATABASE=[{title: "test", body: "testingminefam", id:0}];
let titleInput, bodyInput;

const saveNote = e => {
    e.preventDefault();
    id = _DATABASE[_DATABASE.length-1].id+1;
    _DATABASE.push({title: titleInput, body: bodyInput, id});
    closeBtnClicked(".noteMenu");
    clearNotes();
    nodeLoad();
}

const createNote = (title="Double Click here!", body=null, id=null) => {
    const ul = document.querySelector(".mainArticle ul")
    const li = document.createElement("li");
    const h3 = document.createElement("h3");

    li.classList = "txtCen";
    h3.textContent = title;
    li.appendChild(h3);

    if(id===null){
        li.addEventListener("dblclick", clicked);
    }else{
        const pBody = document.createElement("p");
        pBody.textContent = body;
        li.appendChild(pBody);
    }
    
    ul.appendChild(li)
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
    let btnClass = e.target.className;
    let nodeClass;

    e.target.parentNode.className === "txtCen" ? nodeClass = ".noteMenu"  : (e.target.parentNode.classList.contains("noteMenu") ? nodeClass = ".noteMenu" : nodeClass = "." + (e.target.parentNode.className.replace("Btn","")));

    if(btnClass!=="closeBtn"){
        if(!document.querySelector("section .emailContainer").classList.contains("hiddenSection")){
            document.querySelector("section .emailContainer").classList.toggle("hiddenSection");
        }
    
        document.querySelectorAll("body section").forEach(section=>{
            if(!section.classList.contains("hiddenSection")){
                closeBtnClicked("."+section.classList[0]);
            }
        });
        menuClicked(nodeClass,e.target.className);
    }else{
        closeBtnClicked(nodeClass);
    }
}

const menuClicked = (nodeClass, registerClass=null) => {
    if(registerClass==="registerBtn"){
        document.querySelector("section .emailContainer").classList.toggle("hiddenSection");
    }
    document.querySelector(nodeClass).classList.toggle("hiddenSection");
}

const closeBtnClicked = nodeClass => {
    if(nodeClass===".loginRegisterMenu"){
        if(!document.querySelector("section .emailContainer").classList.contains("hiddenSection")){
            document.querySelector("section .emailContainer").classList.toggle("hiddenSection");
        }
        
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
        titleInput = "";
        bodyInput = "";
    }
}

window.onload = ()=>{
    const sections = document.querySelectorAll("body section");
    const sectionBtns = document.querySelectorAll("section .closeBtn");
    const loginMenuBtn = document.querySelector("ul .loginRegisterMenuBtn .loginBtn");
    const registerMenuBtn = document.querySelector("ul .loginRegisterMenuBtn .registerBtn");
    const registerInput = document.querySelector("section .emailContainer");
    const addBtn = document.querySelector(".noteMenu p button");
    const titleBox = document.querySelector(".noteMenu input");
    const bodyBox = document.querySelector(".noteMenu textarea");

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
    addBtn.addEventListener("click",saveNote);
    titleBox.addEventListener("input",insertInput);
    bodyBox.addEventListener("input",insertInput);
}