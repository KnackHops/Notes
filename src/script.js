const createNote = () => {
    const ul = document.querySelector(".mainArticle ul")
    const li = document.createElement("li");
    const h3 = document.createElement("h3");

    li.classList = "txtCen";
    li.addEventListener("dblclick", clicked);
    h3.textContent = "Double Click here!";
    li.appendChild(h3);
    ul.appendChild(li)
}

const clicked = e => {
    e.preventDefault();
    let btnClass = e.target.className;
    let nodeClass = "." + (e.target.parentNode.className.replace("Btn",""));

    if(btnClass!=="closeBtn"){
        e.type=="dblclick" ?  menuClicked(".noteMenu"):menuClicked(nodeClass,e);
    }else{
        closeBtnClicked(nodeClass);
    }
}

const menuClicked = (nodeClass, e=null) => {
    if(e!==null){
        if(e.target.className==="registerBtn"){
            document.querySelector("section .emailContainer").classList.toggle("hiddenSection");
        }
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

    registerInput.classList.add("hiddenSection");
    sectionBtns.forEach(btn=>btn.addEventListener("click", clicked));
    sections.forEach(section=>section.classList.add("hiddenSection"));

    createNote();
    loginMenuBtn.addEventListener("click", clicked);
    registerMenuBtn.addEventListener("click", clicked);
}