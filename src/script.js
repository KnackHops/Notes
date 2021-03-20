let _DATABASE_=[{title: "test", body: "testingminefam", id:"1"}];

const saveNote = () => {
    
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

const removeNote = () => {
    const lists = document.querySelectorAll(".mainArticle ul li");

    lists.forEach(list => {
        list.parentNode.removeChild(list.title, list.body);
    })
}

const nodeLoad = () => {
    if(_DATABASE_){
        _DATABASE_.forEach(item=>{
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
                closeBtnClicked("."+section.className);
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
    document.querySelector(nodeClass).classList.toggle("hiddenSection");
}

window.onload = ()=>{
    const sections = document.querySelectorAll("body section");
    const sectionBtns = document.querySelectorAll("section .closeBtn");
    const loginMenuBtn = document.querySelector("ul .loginRegisterMenuBtn .loginBtn");
    const registerMenuBtn = document.querySelector("ul .loginRegisterMenuBtn .registerBtn");
    const registerInput = document.querySelector("section .emailContainer");
    const addBtn = document.querySelector(".noteMenu p button");

    registerInput.classList.add("hiddenSection");
    sectionBtns.forEach(btn=>btn.addEventListener("click", clicked));
    sections.forEach(section=>section.classList.add("hiddenSection"));

    nodeLoad();
    loginMenuBtn.addEventListener("click", clicked);
    registerMenuBtn.addEventListener("click", clicked);
    addBtn.addEventListener("click",saveNote);
}