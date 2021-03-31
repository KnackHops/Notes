let _DATABASE=[{title: "test", body: "testingminefam", editable: false, id:0},
{title: "test1", body: "testingminefam1", editable: false, id:1},
{title: "test2", body: "testingminefam2", editable: false, id:2}];

let user_DATABASE=[{
    username: "affafu",
    password: "affafuPass",
    email: "affafu@gmail.com"}];

let titleInput, bodyInput;
let userName, userPass, userEmail;
let editable = false;
let clickingCheck = false;
let currentOpenID = null;
let currentUser = null;

const terminal = (userEdit=false) => {
    closeBtnClicked(".noteMenu",userEdit);
    clearNotes();
    nodeLoad();
}

const logInUserValidate = () => {
    let returnVar = null;

    if(!userName||!userPass){
        alert("Please fill out area");
    }else{
        user_DATABASE.forEach(user=>{
            if(user.username === userName.toLowerCase()){
                if(user.password === userPass){
                    returnVar = user.username;
                }
            }
        })
        if(!returnVar){
            alert("Invalid username or password");
        }
    }
    return returnVar;
}

const logInUser = () => {
    const btn1 = document.querySelector(".loginBtn");
    const btn2 = document.querySelector(".registerBtn");

    btn1.disabled = true;
    btn1.classList.toggle("hiddenSection");
    btn2.classList.toggle("registerBtn");
    btn2.classList.toggle("userPanelBtn");
    btn2.textContent = currentUser;
}

const registerUserValidate = () =>{
    let returnVar = true;

    if(!userName || !userPass || !userEmail) {
        returnVar=false;
        alert("Please fill out every textbox");
    }else{
        if(!passwordCheck(userPass)){
            returnVar=false;
            alert("Password needs to be 6 characters or longer and have one uppercase letter");
        }else{
            if(userName.length<=5){
                returnVar=false;
                alert("Username needs to be 6 characters or longer")
            }else{
                user_DATABASE.forEach(user=>{
                    if(user.username===userName){
                        returnVar=false;
                    }
                    if(user.userEmail===userEmail){
                        returnVar=false;
                    }
                })
                if(returnVar===false){
                    alert("User already exist!");
                }
            }
        }
    }

    return returnVar;
}

const passwordCheck = pass => {
    let returnVar = true;
    let upperCount = 0;
    let lowerCount = 0;

    if(pass.length<=5){
        returnVar = false;
    }else{
        [...pass].forEach(lett => {
            if(lett.toLowerCase() !== lett.toUpperCase()){
                if(lett === lett.toUpperCase()){
                    upperCount++;
                }
                if(lett === lett.toLowerCase()){
                    lowerCount++;
                }
            }
        });
        if(lowerCount<1 || upperCount<1){
            returnVar = false;
        }
    }


    return returnVar;
}

const registerUser = () => {
    let newUser = {
        username: userName.toLowerCase(),
        password: userPass,
        email: userEmail
    }

    user_DATABASE.push(newUser);
    confirm("User Registered!");
}

const userTerminal = () => {
    if(document.querySelector(".emailContainer").classList.contains("hiddenSection")){
        currentUser = logInUserValidate();
        if(currentUser){
            logInUser();
            closeBtnClicked(".loginRegisterMenu");
        }else{
            currentUser=null;
            clearInputs(".loginRegisterMenu")
        }
    }else{
        if(registerUserValidate()){
            registerUser();
            closeBtnClicked(".loginRegisterMenu");
        }else{
            clearInputs(".loginRegisterMenu");
        }
    }
}

const saveNote = () => {
    if(_DATABASE.length){
        id = _DATABASE[_DATABASE.length-1].id + 1;
    }else{
        id = 1;
    }
    _DATABASE.push({title: titleInput, body: bodyInput, editable, id});
    terminal();
}

const editNote = () => {
    _DATABASE.forEach(note=>{
        if(Number(currentOpenID.replace("note",""))===note.id){
            if(titleInput!==note.title){
                note.title=titleInput;
            }
            if(bodyInput!==note.body){
                note.body=bodyInput;
            }
        }
    })
    terminal(true);
}

const deleteNote = id => {
    closeBtnClicked(".noteMenu",true);
    _DATABASE = _DATABASE.filter(note=>note.id!==Number(id));
    clearNotes();
    nodeLoad();
}

const createNote = (title=null, body=null, id=null) => {
    const ul = document.querySelector(".mainArticle ul")
    const li = document.createElement("li");
    const h3 = document.createElement("h3");

    if(!id && id!==0){
        title="Double Click here!";
    }else{
        if(!title){
            title="No Title";
        }else if(!body){
            body="Note here";
        }
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
        li.addEventListener("click",clicked);
    }

    li.classList.add("txtCen");
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
    let btnClass = e.target.classList[0];
    const parent = e.target.parentNode;
    let nodeClass;

    if(btnClass==="addBtn" || btnClass==="editBtn" || btnClass==="closeBtn" || btnClass==="delBtn" || btnClass==="loginregisterFuncBtn" || btnClass==="userPanelBtn"){
        nodeClass=btnClass;
    }else{
        if(parent.classList.contains("defaultNote")){
            nodeClass = ".noteMenu";
        }else if(parent.classList.contains("userNote")){
            nodeClass="userNote";
        }else{
            nodeClass = "." + parent.className.replace("Btn","");
        }
    }

    if(nodeClass==="addBtn"){
        if(titleInput || bodyInput){
            saveNote();
        }else{
            window.alert("Please Enter a title or a body");
        }
    }else if(nodeClass==="editBtn"){
        editNote();
    }else if(nodeClass==="userNote"){
        currentOpenID=parent.id;
        menuClicked(".noteMenu",null,currentOpenID);
    }else if(nodeClass==="closeBtn"){
        if(parent.classList.contains("userEdit")){
            closeBtnClicked("."+ parent.classList[0], true);
        }else{
            closeBtnClicked("." + parent.classList[0]);
        }
    }else if(nodeClass==="delBtn"){
        if(confirm("Are you sure?")){
            deleteNote(currentOpenID.replace("note",""))
        }
    }else if(nodeClass==="loginregisterFuncBtn"){
        userTerminal();
    }else if(nodeClass==="userPanelBtn"){
        console.log("hello", currentUser);
    }else{
        menuClicked(nodeClass,e.target.className);
    }
}

const checkingOpenedFrames = () => {
    document.querySelectorAll(".activeSection").forEach(section=>{
            if(section.classList.contains("userEdit")){
                closeBtnClicked("."+ section.classList[0], true);
            }else{
                closeBtnClicked("." + section.classList[0]);
            }
    })
}

const menuClicked = (nodeClass, registerClass=null, noteID=false) => {
    checkingOpenedFrames();

    if(nodeClass===".loginRegisterMenu"){
        if(registerClass==="registerBtn"){
            document.querySelector("section p button").textContent = "Register";
            document.querySelector("section .emailContainer input").disabled = false;
            document.querySelector("section .emailContainer").classList.toggle("hiddenSection");
            document.querySelector(nodeClass).classList.toggle("registerRN");
        }else{
            document.querySelector("section p button").textContent = "Log in";
        }
        document.querySelectorAll(`${nodeClass} p  input`).forEach(inp=>{
            if(inp.parentNode.classList[0]!==".emailContainer"){
                inp.disabled=false;
            }
        })
    }else{
        const delBtn = document.querySelector(".delBtn");
        if(!noteID){
            delBtn.classList.add("hiddenSection");
            delBtn.disabled = true;
            activeNote(false, true);
        }else{
            const addBtn = document.querySelector(".addBtn");
            addBtn.classList.toggle("addBtn");
            addBtn.classList.toggle("editBtn");
            addBtn.textContent = "Edit";
            _DATABASE.forEach(note=>{
                if(Number(noteID.replace("note","")) === note.id){
                    document.querySelector(`${nodeClass} input`).value = titleInput = note.title;
                    document.querySelector(`${nodeClass} textarea`).value = bodyInput = note.body;
                    if(!note.editable){
                        document.querySelector(`${nodeClass} .extraInput p input`).checked = false;
                        activeNote();
                    }else{
                        document.querySelector(`${nodeClass} .extraInput p input`).checked = true;
                        activeNote(false, true);
                    }
                }
            })
            document.querySelector(".delBtn").disabled=false;
            delBtn.classList.remove("hiddenSection");
            document.querySelector(nodeClass).classList.toggle("userEdit");
        }
    }
        document.querySelector(nodeClass).classList.toggle("hiddenSection");
        document.querySelector(nodeClass).classList.toggle("activeSection");
}

const closeBtnClicked = (nodeClass,userEdit,initialize=false) => {
    if(nodeClass===".loginRegisterMenu"){
        if(document.querySelector(nodeClass).classList.contains("registerRN") || initialize){
            document.querySelector("section .emailContainer").classList.toggle("hiddenSection");
            document.querySelector("section .emailContainer input").disabled = true;
            initialize ? "" : document.querySelector(nodeClass).classList.toggle("registerRN");
        }
        document.querySelectorAll(".loginRegisterMenu p input").forEach(inp=>inp.disabled=true);
    }else{
        if(userEdit){
            const addBtn = document.querySelector(".editBtn");
            addBtn.classList.toggle("editBtn");
            addBtn.classList.toggle("addBtn");
            addBtn.textContent = "Add Note";
            document.querySelector(".noteMenu").classList.toggle("userEdit");
        }
        activeNote(false,false);
    }
    
    clearInputs(nodeClass);

    if(initialize){
        document.querySelector(nodeClass).classList.toggle("hiddenSection");
    }else{
        document.querySelector(nodeClass).classList.toggle("hiddenSection");
        document.querySelector(nodeClass).classList.toggle("activeSection");
    }
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
        currentOpenID=null;
    }
}

const activeNote = (fromEdit=false, isActive = false) => {
    document.querySelector(".noteMenu input").disabled = !isActive;
    document.querySelector(".noteMenu textarea").disabled = !isActive;
    document.querySelector(".noteMenu .extraInput p button:first-child").disabled = !isActive;
    document.querySelector(".noteMenu").classList.toggle("nonEditable");

    if(fromEdit){
        _DATABASE.forEach(note => {
        if(Number(currentOpenID.replace("note",""))===note.id){
                note.editable = !note.editable;
        }
        })
    }
}

window.onload = () =>{
    const sections = document.querySelectorAll("body section");
    const sectionCloseBtns = document.querySelectorAll("section .closeBtn");
    //loginRegister
    const loginMenuBtn = document.querySelector("ul .loginRegisterMenuBtn .loginBtn");
    const registerMenuBtn = document.querySelector("ul .loginRegisterMenuBtn .registerBtn");
    const loginregisterFuncBtn = document.querySelector(".loginRegisterMenu p .loginregisterFuncBtn");
    const usernameInput = document.querySelector("#usernameInput");
    const passwordInput = document.querySelector("#passwordInput");
    const emailInput = document.querySelector("#emailInput");
    //note
    const addBtn = document.querySelector(".addBtn");
    const delBtn = document.querySelector(".delBtn");
    const titleBox = document.querySelector(".noteMenu input");
    const bodyBox = document.querySelector(".noteMenu textarea");
    const chckBox = document.querySelector(".noteMenu .extraInput p input");

    sectionCloseBtns.forEach(btn=>btn.addEventListener("click", clicked));

    sections.forEach(section=>{
        closeBtnClicked("."+section.classList[0],false,true);   
    });

    const insertInput = e => {
        if(e.target.classList.contains("titleBox")){
            titleInput = e.target.value;
        }else if(e.target.classList.contains("bodyBox")){
            bodyInput = e.target.value;
        }else if(e.target.id === "usernameInput"){
            userName = e.target.value;
        }else if(e.target.id === "passwordInput"){
            userPass = e.target.value;
        }else if(e.target.id === "emailInput"){
            userEmail = e.target.value;
        }
    }
    
    const checkingBox = e => {
        e.target.checked ? editable = true : editable = false;
        if(e.target.parentNode.parentNode.parentNode.classList.contains("userEdit")){
            activeNote(true,editable);
        }
    }

    const focusedTT = e => {
        e.target.parentNode.classList.toggle("focusTT");
    }

    nodeLoad();

    [loginMenuBtn, registerMenuBtn, loginregisterFuncBtn, addBtn, delBtn].forEach(item=>item.addEventListener("click",clicked));
    [usernameInput, emailInput, passwordInput, titleBox, bodyBox].forEach(item=>item.addEventListener("input",insertInput));

    //loginregister
    usernameInput.addEventListener("focus",focusedTT);
    passwordInput.addEventListener("focus",focusedTT);
    usernameInput.addEventListener("blur",focusedTT);
    passwordInput.addEventListener("blur",focusedTT);
    //note
    chckBox.addEventListener("change", checkingBox);
}