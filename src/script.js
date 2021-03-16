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
    if(e.type==="dblclick"){
        noteClicked();
    }else{
        if(e.target.className==="loginBtn"){
            console.log("logging in");
        }else{
            console.log("registering")
        }
    }
}

const noteClicked = () => {
    const noteMenu = document.querySelector(".noteMenu");
    noteMenu.classList.remove("hiddenSection");
}

window.onload = ()=>{
    const sections = document.querySelectorAll("body section");
    const loginBtn = document.querySelector("ul li .loginBtn");
    const registerBtn = document.querySelector("ul li .registerBtn");

    sections.forEach(section=>section.classList.add("hiddenSection"));

    createNote();
    loginBtn.addEventListener("click", clicked);
    registerBtn.addEventListener("click", clicked);
}