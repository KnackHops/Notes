const _ISLOGGEDKEY = "notesIsLogged";
const _USERLOGGEDKEY = "notesUserLogged";
const _DEFAULTPFP = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAGMAAABeCAYAAAA336rmAAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAAAJcEhZcwAADsMAAA7DAcdvqGQAAADlSURBVHhe7dExAQAwDMCgCWj9y+1scORAAW9mL4YyIGVAyoCUASkDUgakDEgZkDIgZUDKgJQBKQNSBqQMSBmQMiBlQMqAlAEpA1IGpAxIGZAyIGVAyoCUASkDUgakDEgZkDIgZUDKgJQBKQNSBqQMSBmQMiBlQMqAlAEpA1IGpAxIGZAyIGVAyoCUASkDUgakDEgZkDIgZUDKgJQBKQNSBqQMSBmQMiBlQMqAlAEpA1IGpAxIGZAyIGVAyoCUASkDUgakDEgZkDIgZUDKgJQBKQNSBqQMSBmQMiBlQMqAlAEpg7H3AU/beRBUx2yaAAAAAElFTkSuQmCC";

let _DATABASE=[{title: "test", body: "testingminefam", editable: false, id:0, user: "affafu", date: { month: 0, day: 25, year: 2021}, lastUpdated: { month: 3, day: 15, year: 2021}},
{title: "test1", body: "testingminefam1", editable: false, id:1, user: "affafu", date: { month: 2, day: 27, year: 2021}, lastUpdated: { month: 2, day: 29, year: 2021}},
{title: "test2", body: "testingminefam2", editable: false, id:0, user: "barrys", date: { month: 2, day: 28, year: 2021}, lastUpdated: null}];

let local_DATABASE = [{title: "testingminefam3", body: "testingminefam3", editable: false, id:0, user: "localUser", date: { month: 2, day: 25, year: 2020}, lastUpdated: null}]

let user_DATABASE=[{
    username: "affafu",
    email: "affafu@gmail.com",
    mobile: "null",
    pfp: "default",
    nickname: "plop"
},{
    username: "barrys",
    email: "barry@gmail.com",
    mobile: null,
    pfp: "default",
    nickname: null
}];

let login_DATABASE=[{
    username: "affafu",
    password: "affafuPass",
},{
    username: "barrys",
    password: "barryPass",
}]

let titleInput, bodyInput;
let userName, userPass, userEmail;
let sideInput;
let userMobile, userEditEmail, userNickName;
let editable = false;
let saveLocalChk = false;
let clickingCheck = false;
let currentOpenID = null;
let currentUser = null;
let currentFile = null;

const terminal = (userEdit=false) => {
    closeBtnClicked(".noteMenu",userEdit);
    nodeLoad();
}

const orderList = whichOrder => {
    let newDbase = [];

    _DATABASE.forEach(item=>{
        if(item.user===currentUser){
            newDbase.push(item);
        }
    })

    local_DATABASE.forEach(item=>{
        if(item){
            newDbase.push(item);
        }
    })

    if(whichOrder==="ascendCreated"){
        console.log(descendCreated(newDbase));
        nodeLoad(ascendCreated(newDbase));
    }else if(whichOrder==="descendCreated"){
        console.log(ascendCreated(newDbase));
        nodeLoad(descendCreated(newDbase));
    }else if(whichOrder==="ascendEdited"){
        console.log(ascendEdited(newDbase));
        nodeLoad(ascendEdited(newDbase));
    }else if(whichOrder==="descendEdited"){
        console.log(descendEdited(newDbase));
        nodeLoad(descendEdited(newDbase));
    }else{
        nodeLoad();
    }
    
    // console.log(descendCreated(newDbase));
    
    // console.log(ascendCreated(newDbase));

    // console.log(ascendEdited(newDbase));

    // console.log(descendEdited(newDbase));
}

const ascendCreated = arrayDbase => {
    return arrayDbase.sort(
        function(a,b){
            return totalDate(a.date.day, a.date.month, a.date.year) - totalDate(b.date.day, b.date.month, b.date.year);
        }
    );
}

const descendCreated = arrayDbase => {
    return arrayDbase.sort(
        function(a,b){
            return totalDate(b.date.day, b.date.month, b.date.year) - totalDate(a.date.day, a.date.month, a.date.year);
        }
    );
}

const ascendEdited = arrayDbase => {
    return arrayDbase.sort(
        function(a,b){
            let aTotal, bTotal;

            aTotal = dateEditedCheck(a)
            bTotal = dateEditedCheck(b);

            return aTotal - bTotal;
        }
    )
}

const descendEdited = arrayDbase => {
    return arrayDbase.sort(
        function(a,b){
            let aTotal, bTotal;

            aTotal = dateEditedCheck(a)
            bTotal = dateEditedCheck(b);

            return bTotal - aTotal;
        }
    )
}

const dateEditedCheck = ({lastUpdated,date}) => {
    let total;

    if(lastUpdated){
        total = totalDate(lastUpdated.day, lastUpdated.month, lastUpdated.year);
    }else{
        total = totalDate(date.day, date.month, date.year);
    }

    return total;
}

const totalDate = (day, month,year) => {
    return ((day + ((month + 1) * 30.4) + (year * 365)))
}

const dateNowGet = () => {
    const d = new Date();
    let newDate = {};
    newDate.month = d.getMonth();
    newDate.day = d.getDate();
    newDate.year =  d.getFullYear();

    return newDate;
}

const logInUserValidate = () => {
    let returnVar = null;

    if(!userName||!userPass){
        alert("Please fill out area");
    }else{
        login_DATABASE.forEach(user=>{
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

const userLogInOut = (loggingIn = true) => {
    const btn1 = document.querySelector(".loginBtn");
    const btn2 = document.querySelector(".loginRegisterMenuBtn:nth-child(2) button");
    const userPanel = document.querySelector("nav .userPanel");
    const userNavBtns = document.querySelector("nav ul:nth-child(2)");


    userPanel.classList.toggle("animAct");

    btn1.disabled = loggingIn;
    btn1.classList.toggle("hiddenSection");
    btn1.parentNode.classList.toggle("disabled");
    userNavBtns.classList.toggle("loggedInUL");
    btn2.classList.toggle("registerBtn");
    btn2.classList.toggle("userPanelBtn");

    if(loggingIn){
        let user = searchUserDBASE('username',currentUser,'nickname','pfp');
        const imgCon = document.createElement("li");
        const imgIn = document.createElement("img");

        imgCon.classList.add("pfpContainer");
        imgCon.classList.add("nonProfilePfp");
        imgIn.setAttribute("alt","profile picture");
        imgIn.classList.add("pfp");

        imgCon.appendChild(imgIn);
        userNavBtns.appendChild(imgCon);

        user['nickname'] ? panelBtnChange(user.nickname) : panelBtnChange(currentUser);

        user['pfp'] === 'default' ? pfpNavChange(_DEFAULTPFP) : pfpNavChange(user['pfp']);
    }else{
        const imgCon = document.querySelector(".pfpContainer.nonProfilePfp");
        const imgIn = document.querySelector(".pfpContainer.nonProfilePfp .pfp");

        imgCon.removeChild(imgIn);
        imgCon.parentNode.removeChild(imgCon);
        
        
        checkingOpenedFrames();
        btn2.textContent = "Register";
        currentUser=null;
    }
    nodeLoad();
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
            if(userName ==="localUser"){
                alert("Please pick a valid username");
            }else{
                if(userName.length<=5){
                    returnVar=false;
                    alert("Username needs to be 6 characters or longer")
                }else{
                    if(searchUserDBASE('username',userName)){
                        returnVar=false;
                    }
                    if(searchUserDBASE('email',userEmail)){
                        returnVar=false;
                    }
                    if(returnVar===false){
                        alert("User already exist!");
                    }
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
        email: userEmail,
        pfp: "default",
        nickname: null
    }

    user_DATABASE.push(newUser);
    login_DATABASE.push({
        username: userName.toLowerCase(),
        password: userPass
    })
    confirm("User Registered!");
}

const userTerminal = () => {
    if(document.querySelector(".emailContainer").classList.contains("hiddenSection")){
        currentUser = logInUserValidate();
        if(currentUser){
            accountLogged(true);
            userLogInOut();
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
    let id = null;
    let newDate = dateNowGet();
    let user;

    if(currentUser && !saveLocalChk){
        user = currentUser;

        _DATABASE.forEach(item=>{
            if(item.user===currentUser){
                id=item.id;
            }
        })
    }else{
        user = "localUser";

        local_DATABASE.forEach(item=>{
            if(item){
                id=item.id;
            }
        })
    }

    if(id || id===0){
        id+=1;
    }else{
        id=0;
    }

    let newUser = {title: titleInput, body: bodyInput, editable, id, user, date: newDate};

    if(currentUser && !saveLocalChk){
        _DATABASE.push(newUser);
    }else{
        local_DATABASE.push(newUser);
    }

    terminal();
}

const editNote = () => {
    // editing note
    let id = currentOpenID;
    
    if(id.indexOf("note")===0){
        id = Number(currentOpenID.replace("note",""));
        _DATABASE.forEach(item=>{
            if(item.user===currentUser){
                if(id===item.id){
                    [item.title, item.body, item.lastUpdated] = editAndCheck(item.title, item.body);
                }
            }
        })
    }else{
        id = Number(currentOpenID.replace("localNote",""));
        local_DATABASE.forEach(item=>{
            if(id===item.id){
                [item.title, item.body, item.lastUpdated] = editAndCheck(item.title, item.body);
            }
        })
    }

    terminal(true);
}

const editAndCheck = (title, body) => {
    let edited=false;
    let lastUpdated=null;

    if(title!==titleInput){
        title=titleInput;
        edited=true;
    }

    if(body!==bodyInput){
        body=bodyInput;
        edited=true;
    }

    if(edited){
        lastUpdated = dateNowGet();
    }

    return [title,body,lastUpdated];
}

const deleteNote = () => {
    let id = currentOpenID;

    closeBtnClicked(".noteMenu",true);
    
    if(id.indexOf("note")==0){
        id = id.replace("note","");
        _DATABASE = _DATABASE.filter(item=>{
            if(currentUser===item.user){
                if(item.id!==Number(id)){
                    return item;
                }
            }else {
                return item;
            }
        });
    }else{
        id = id.replace("localNote","");
        local_DATABASE = local_DATABASE.filter(item=>item.id!==Number(id));
    }

    nodeLoad();
}

const createNote = (title=null, body=null, id=null, userN=null) => {
    const ul = document.querySelector(".mainArticle .mainList")
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
        if(userN!=="localUser"){
            li.setAttribute("data-username", userN);
            li.setAttribute("id","note"+id);
        }else{
            li.setAttribute("data-username", userN);
            li.setAttribute("id","localNote"+id);
        }
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

const nodeLoad = (altDbase = null) => {
    clearNotes();

    let lastID;

    if(altDbase){
        altDbase.forEach(item=>{
            createNote(item.title, item.body, item.id, item.user);
        })
    }else{
        if(_DATABASE){
            _DATABASE.forEach(item=>{
                if(currentUser===item.user){
                    createNote(item.title, item.body, item.id, item.user);
                    lastID=item.id
                }
            })
        }

        if(local_DATABASE){
            local_DATABASE.forEach(item=>{
                createNote(item.title, item.body, item.id, item.user);
                lastID++;
            })
        }
    }

    createNote();
}

//clickedterminal
const clicked = e => {
    e.preventDefault();
    let btnClass = e.target.classList[0];
    const parent = e.target.parentNode;
    let nodeClass;
    console.log(btnClass);
    if(btnClass==="addBtn" 
    || btnClass==="editBtn" 
    || btnClass==="closeBtn" 
    || btnClass==="delBtn"  
    || btnClass==="loginregisterFuncBtn" 
    || btnClass==="userPanelBtn" 
    || btnClass==="logOutBtn"
    || btnClass==="saveProfileBtn"
    || btnClass==="clearNickname"
    || btnClass==="sidePanelBtn"){
        nodeClass=btnClass;
    }else{
        if(parent.classList.contains("defaultNote")){
            nodeClass = ".noteMenu";
        }else if(parent.classList.contains("userNote")){
            nodeClass="userNote";
        }else{
            if(btnClass==="userSettingsBtn"){
                nodeClass = "." + btnClass.replace("Btn", "");
            }else{
                nodeClass = "." + parent.className.replace("Btn","");
            }
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
            deleteNote();
        }
    }else if(nodeClass==="loginregisterFuncBtn"){
        //log in button
        userTerminal();
    }else if(nodeClass==="userPanelBtn"){
        activePanel();
    }else if(nodeClass==="logOutBtn"){
        //log out button
        accountLogged(false);
        userLogInOut(false);
        activePanel();
    }else if(nodeClass==="saveProfileBtn"){
        saveProfile();
    }else if(nodeClass==="clearNickname"){
        console.log("clear nickname");
    }else if(nodeClass==="sidePanelBtn"){
        userMobileNickHandler();
    }else{
        menuClicked(nodeClass,e.target.className);
    }
}

const checkingOpenedFrames = () => {
    document.querySelectorAll("sections.activeSection").forEach(section=>{
            if(section.classList.contains("userEdit")){
                closeBtnClicked("."+ section.classList[0], true);
            }else{
                closeBtnClicked("." + section.classList[0]);
            }
    })

    if(document.querySelector("aside.userSidePanel").classList.contains("activeSection")){
        menuClicked(".userSidePanel");
    }
}

// mainmenu handler
const menuClicked = (nodeClass, targetClass=null) => {
    let returnVar = true;
    nodeClass===".userSidePanel" ? "" : checkingOpenedFrames();

    console.log(nodeClass, targetClass);

    if(nodeClass===".loginRegisterMenu"){
        loginRegisterMenuPanelHandler(nodeClass, targetClass);
    }else if (nodeClass===".noteMenu"){
        noteMenuPanelHandler(nodeClass);
    }else if (nodeClass===".userSettings"){
        userSettingsPanelHandler();
    }else if (nodeClass===".userSidePanel"){
        returnVar = sidePanelHandler(targetClass);
    }

    if(returnVar){
        document.querySelector(nodeClass).classList.toggle("hiddenSection");
        document.querySelector(nodeClass).classList.toggle("activeSection");
    }
}

const closeBtnClicked = (nodeClass,userEdit,initialize=false) => {
    if(nodeClass === ".loginRegisterMenu"){
        if(document.querySelector(nodeClass).classList.contains("registerRN") || initialize){
            document.querySelector("section .emailContainer").classList.toggle("hiddenSection");
            document.querySelector("section .emailContainer input").disabled = true;
            initialize ? "" : document.querySelector(nodeClass).classList.toggle("registerRN");
        }
        document.querySelectorAll(".loginRegisterMenu p input").forEach(inp=>inp.disabled=true);
    }else if(nodeClass === ".noteMenu"){
        if(userEdit){
            const addBtn = document.querySelector(".editBtn");
            addBtn.classList.toggle("editBtn");
            addBtn.classList.toggle("addBtn");
            addBtn.textContent = "Add Note";
            document.querySelector(".noteMenu").classList.toggle("userEdit");
        }else{
            const saveLocallyCon = document.querySelector(".extraInput .saveLocallyContainer");

            if(!saveLocallyCon.childNodes[3].disabled){
                saveLocallyCon.childNodes[3].disabled = true;
                saveLocallyCon.childNodes[3].checked = false;
                saveLocalChk = false;
            }
        }
        activeNote(false,false);
    }else if(nodeClass===".userSettings"){
        const sidePanelControl = document.querySelector(`${nodeClass} .sidePanelControl`);

        if(document.querySelector(nodeClass).classList.contains("asideOpen")){
            menuClicked(".userSidePanel");
        }

        userEditEmail=null;
        userNickName=null;
        userMobile=null;

        [sidePanelControl.childNodes[1], sidePanelControl.childNodes[3], sidePanelControl.childNodes[5]].forEach((item, i)=>{
            if(i!==2){
                item.classList.remove("userSidePanelBtn");
                item.childNodes[1].removeEventListener("click",clicked);
                item.childNodes[1].disabled=true;
                item.childNodes[1].textContent = "Add";
            }else{
                item.childNodes[1].textContent = "Nada";
            }
        })
    }

    clearInputs(nodeClass);

    if(initialize){
        document.querySelector(nodeClass).classList.toggle("hiddenSection");
    }else{
        document.querySelector(nodeClass).classList.toggle("hiddenSection");
        document.querySelector(nodeClass).classList.toggle("activeSection");
    }
}

const loginRegisterMenuPanelHandler = (nodeClass, registerClass)=>{
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
}

const noteMenuPanelHandler = nodeClass => {
    const delBtn = document.querySelector(".delBtn");
    const locallySaveCheck = document.querySelector(".extraInput .saveLocallyContainer");

    if(!currentOpenID){
        delBtn.classList.add("hiddenSection");
        delBtn.disabled = true;
        activeNote(false, true);
        if(currentUser){
            if(locallySaveCheck.classList.contains("hiddenSection")){
                locallySaveCheck.classList.remove("hiddenSection");
            }
            if(locallySaveCheck.childNodes[3].classList.contains("hiddenSection")){
                locallySaveCheck.childNodes[1].innerText = "Save Locally: ";
                locallySaveCheck.childNodes[3].classList.remove("hiddenSection");
                locallySaveCheck.childNodes[3].disabled ? locallySaveCheck.childNodes[3].disabled = false : "";
            }
        }else{
            if(!locallySaveCheck.classList.contains("hiddenSection")){
                locallySaveCheck.classList.add("hiddenSection");
                locallySaveCheck.childNodes[3].disabled ? "" : locallySaveCheck.childNodes[3].disabled = true;
            }
        }
    }else{
        let id = currentOpenID;
        let title, body, date;
        const addBtn = document.querySelector(".addBtn");

        if(locallySaveCheck.classList.contains("hiddenSection")){
            locallySaveCheck.classList.remove("hiddenSection");
        }

        if(!locallySaveCheck.childNodes[3].classList.contains("hiddenSection")){
            locallySaveCheck.childNodes[3].classList.add("hiddenSection");
            locallySaveCheck.childNodes[3].disabled ? "" : locallySaveCheck.childNodes[3].disabled = true;
        }

        addBtn.classList.toggle("addBtn");
        addBtn.classList.toggle("editBtn");
        addBtn.textContent = "Edit";

        if(id.indexOf("note")===0){
            id = Number(id.replace("note",""));
            _DATABASE.forEach(item=>{
                if(currentUser===item.user){
                    if(id === item.id){
                        title = titleInput = item.title;
                        body = bodyInput = item.body;
                        editable = item.editable;
                        date = `created: ${item.date.month+1}/${item.date.day}/${item.date.year}`;
                        if(item.lastUpdated){
                            date += ` edited: ${item.lastUpdated.month+1}/${item.lastUpdated.day}/${item.lastUpdated.year}`;
                        }
                    }
                }
            })
        }else{
            id = Number(id.replace("localNote",""));
            local_DATABASE.forEach(item=>{
                if(item.id===id){
                    title = titleInput = item.title;
                    body = bodyInput = item.body;
                    editable = item.editable;
                    date = `created: ${item.date.month+1}/${item.date.day}/${item.date.year}`;
                    if(item.lastUpdated){
                        date+=` edited: ${item.lastUpdated.month+1}/${item.lastUpdated.day}/${item.lastUpdated.year}`;
                    }
                }
            })
        }

        locallySaveCheck.childNodes[1].innerText = date;
        document.querySelector(`${nodeClass} input`).value = title;
        document.querySelector(`${nodeClass} textarea`).value = body;

        if(!editable){
            document.querySelector(`${nodeClass} .extraInput .checkEditContainer input`).checked = false;
            activeNote();
        }else{
            document.querySelector(`${nodeClass} .extraInput .checkEditContainer input`).checked = true;
            activeNote(false, true);
        }

        document.querySelector(".delBtn").disabled=false;
        delBtn.classList.remove("hiddenSection");
        document.querySelector(nodeClass).classList.toggle("userEdit");
    }
}

const userSettingsPanelHandler = () => {
    activePanel();
    const sidePanelControl = document.querySelector(".sidePanelControl");
    const userObj = searchUserDBASE('username',currentUser,'nickname','pfp');
    const emailNumObj = searchUserDBASE('username', currentUser, 'email', 'mobile');

    if(userObj['pfp'] === "default"){
        pfpChange(_DEFAULTPFP);
        pfpEditCheck(false);
    }else{
        pfpChange(userObj['pfp']);
        pfpEditCheck(true);
    }

    [sidePanelControl.childNodes[1], sidePanelControl.childNodes[3], sidePanelControl.childNodes[5]].forEach((item,i)=>{
        if(i!==2){
            item.classList.add("userSidePanelBtn");
            item.childNodes[1].addEventListener("click",clicked);
            item.childNodes[1].disabled=false;
            i === 0 ? 
            (userObj.nickname ? item.childNodes[1].textContent = userNickName = userObj.nickname : "") : 
            (emailNumObj.mobile ? item.childNodes[1].textContent = userMobile = emailNumObj.mobile : "" );
        }else{
            item.childNodes[1].textContent = userEditEmail = emailNumObj.email;
        }
        
    })
}

const sidePanelHandler = (targetClass = null) => {
    // const mobileActBtn = document.querySelector(".sidePanelControl > p:nth-child(1) > button");
    // const mobileBtn = document.querySelector("aside.userSidePanel > p:nth-Child(2) > .mobileBtn");
    let returnVar = true;
    const sidePanelControl = document.querySelector(".userSettings > .sidePanelControl");
    const userSideInsertBox = document.querySelector(".userSidePanel > p:nth-child(1)");
    const userSidePanelBtn = document.querySelector(".userSidePanel > .fd > .sidePanelBtn");
    const userSettings = document.querySelector("section.userSettings");

    if(!targetClass){
        targetClass = userSideInsertBox.childNodes[3].attributes.data_open.value + "Btn";
    }

    if(userSettings.classList.contains("asideOpen") && !userSideInsertBox.parentNode.classList.contains("hiddenSection") && targetClass.replace("Btn","")===userSideInsertBox.childNodes[3].attributes.data_open.value){
        sidePanelInputReset(userSideInsertBox, sidePanelControl, userSidePanelBtn);
    }else{
        returnVar = sidePanelInputReset(userSideInsertBox, sidePanelControl);

        if(targetClass==="nickNameBtn"){
            userSideInsertBox.childNodes[1].innerText = "New Nickname:";
            userSideInsertBox.childNodes[3].setAttribute("data_open", "nickName");
            sidePanelControl.childNodes[1].childNodes[1].textContent = "Cancel";
            userNickName ? userSideInsertBox.childNodes[3].value = sideInput = userNickName : "";
        }else{
            userSideInsertBox.childNodes[1].innerText = "Mobile Number:";
            userSideInsertBox.childNodes[3].setAttribute("data_open", "mobile");
            sidePanelControl.childNodes[3].childNodes[1].textContent = "Cancel";
            userMobile ? userSideInsertBox.childNodes[3].value = sideInput = userMobile : "";
        }

        sideInput ? userSidePanelBtn.textContent = "Edit" : (returnVar ? "" : userSidePanelBtn.textContent = "Add");
    }

    if(returnVar){
        document.querySelector("section.userSettings").classList.toggle("asideOpen");
    }

    return returnVar;
}

const sidePanelInputReset = (userSideNode, sidePanelNode, userSidePanelBtn=false) => {
    let returnVar = true;

    if(userSideNode.childNodes[3].attributes.data_open){
        if(userSideNode.childNodes[3].attributes.data_open.value === "nickName"){
            userNickName ? sidePanelNode.childNodes[1].childNodes[1].textContent = userNickName : sidePanelNode.childNodes[1].childNodes[1].textContent = "Add";
        }else{
            userMobile ? sidePanelNode.childNodes[3].childNodes[1].textContent = userMobile : sidePanelNode.childNodes[3].childNodes[1].textContent = "Add";
        }

        if(userSidePanelBtn){
            userSidePanelBtn.textContent === "Add" ? "" : userSidePanelBtn.textContent = "Add";
            userSideNode.childNodes[1].innerText = "Insert Value:";
            userSideNode.childNodes[3].removeAttribute("data_open");
        }else{
            returnVar = userSidePanelBtn;
        }

        if(userSideNode.childNodes[3].value !== ""){
            userSideNode.childNodes[3].value = "";
            sideInput = "";
        }
    }

    return returnVar;
}

const clearInputs = whichNode => {
    if(whichNode===".loginRegisterMenu"){
        document.querySelectorAll(`${whichNode} p input`).forEach(input=>input.value = "");
    }else if(whichNode===".userSettings"){
        pfpRemove(null);
        // nickLabelChange(null);
    }else{
        document.querySelector(`${whichNode} input`).value="";
        document.querySelector(`${whichNode} textarea`).value="";
        document.querySelector(`${whichNode} .extraInput .checkEditContainer input`).checked = false;
        titleInput = "";
        bodyInput = "";
        editable = false;
        currentOpenID=null;
    }
}

const activeNote = (fromEdit=false, isActive = false) => {
    
    const noteMenu = document.querySelector(".noteMenu");

    document.querySelector(".noteMenu input").disabled = !isActive;
    document.querySelector(".noteMenu textarea").disabled = !isActive;
    document.querySelector(".noteMenu .extraInput p button:first-child").disabled = !isActive;

    if(fromEdit){
        if(isActive && noteMenu.classList.contains("nonEditable")){
            noteMenu.classList.toggle("nonEditable");
        }else if(!isActive && !noteMenu.classList.contains("nonEditable")){
            noteMenu.classList.toggle("nonEditable");
        }

        let id = currentOpenID;

        if(id.indexOf("note")===0){
            id = Number(currentOpenID.replace("note",""));
            _DATABASE.forEach(item => {
                if(item.user===currentUser){
                    if(id===item.id){
                        item.editable = !item.editable;
                    }
                }
            })
        }else{
            id = Number(currentOpenID.replace("localNote",""));
            local_DATABASE.forEach(item=>{
                if(id===item.id){
                    item.editable = !item.editable;
                }
            })
        }
        
    }else{
        if(noteMenu.classList.contains("nonEditable")){
            noteMenu.classList.toggle("nonEditable");
        }
    }
}

const activePanel = () => {
    const navNode = document.querySelector("nav .userPanel");

    if(navNode.classList.contains("panelActive")){
        navNode.classList.toggle("panelActive");
        navNode.classList.toggle("panelInactive");
        
        navNode.childNodes[1].childNodes[0].disabled = true;
        navNode.childNodes[3].childNodes[0].disabled = true;
        
    }else{
        if(navNode.classList.contains("panelInactive")){
            navNode.classList.toggle("panelActive");
        }
        setTimeout(()=>{
            navNode.childNodes[1].childNodes[0].disabled = false;
            navNode.childNodes[3].childNodes[0].disabled = false;
        }, 200)

        navNode.classList.toggle("panelInactive");
    }
    
}

const userSettingsLabelChange = (btnNode, label="Add") => {
    btnNode.textContent = label;
}

const checkLoggedAccount = () => {
    let returnVar = false;
    if(localStorage.getItem(_USERLOGGEDKEY)){
        searchUserDBASE('username', localStorage.getItem(_USERLOGGEDKEY)) ? currentUser = localStorage.getItem(_USERLOGGEDKEY) : localStorage.removeItem(_USERLOGGEDKEY);
    
        if(currentUser){
            returnVar = true;
            userLogInOut();
        }else{
            localStorage.removeItem(_USERLOGGEDKEY);
        }
    }
    
    return returnVar;
}

const accountLogged = isLogged => {
    isLogged ? localStorage.setItem(_USERLOGGEDKEY, currentUser) : localStorage.removeItem(_USERLOGGEDKEY);
}

const saveProfile = () => {
    //checks if currentFile was changed
    //currentFile by default is null
    //currentFile having a value other than null means it was changed
    if(currentFile){
        currentFile === "default" ? pfpNavChange(_DEFAULTPFP) : pfpNavChange(currentFile);
        updateUserDBASE(currentUser,'pfp',currentFile);
    }
    currentFile=null;

    
    
    if(userNickName){
        panelBtnChange(userNickName);
    }else{
        panelBtnChange(currentUser);
    }
    
    updateUserDBASE(currentUser,'nickname',userNickName);
    updateUserDBASE(currentUser,'mobile',userMobile);

    closeBtnClicked(".userSettings");
}

const userMobileNickHandler = () => {
    const sidePanelControl = document.querySelector("aside.userSidePanel > p:nth-child(1)");

    if(sidePanelControl.childNodes[3].attributes.data_open.value==="nickName"){
        if(sideInput){
            userNickName = sideInput;
        }else{
            if(userNickName){
                userNickName = null;
            }else{
                alert("empty");
            }
        }
    }else{
        if(sideInput){
            userMobile = sideInput;
        }else{
            if(userMobile){
                userMobile=null;
            }else{
                alert("empty");
            }
        }
    }

    menuClicked(".userSidePanel");
}

const pfpUpload = e => {
    const file = e.target.files[0];
    const reader = new FileReader();

    reader.onload = e => {
        if(e.target.result){
            let fileStr = e.target.result.split(",");
            if(fileStr[0].includes("data:image/")){
                if(!fileStr[0].includes("gif")){
                    pfpChange(e.target.result);
                    pfpEditCheck(true);
                    currentFile=e.target.result;
                }else{
                    alert("Gif file prohibited");
                }
            }else{
                alert("not an image");
            }
        }
    }

    reader.onerror = e => {
        alert(e.target.error);
    }

    reader.readAsDataURL(file);
}

const pfpRemove = e => {
    let ans;
    e ?  ans = confirm("are you sure?") : true;

    if(ans){
        pfpChange(_DEFAULTPFP);
        pfpEditCheck(false);
        currentFile="default";
    }
}

const pfpEditCheck = userPfpEditable => {
    const pfpCon = document.querySelector(".userSettings p .pfpContainer");
    if(userPfpEditable){
        if(!pfpCon.classList.contains("pfpClickable")){
            pfpCon.classList.add("pfpClickable");
            pfpCon.addEventListener("click", pfpRemove);
        }
    }else{
        pfpCon.classList.remove("pfpClickable");
        pfpCon.removeEventListener("click",pfpRemove);
    }
}

const pfpChange = newPfP => {
    document.querySelector(".userSettings .pfpContainer .pfp").src=newPfP;
}

const pfpNavChange = newPfP => {
    document.querySelector(".loggedInUL .pfpContainer .pfp").src=newPfP;
}

const panelBtnChange = user => {
    document.querySelector(".loginRegisterMenuBtn:nth-child(2) > button").textContent = user;
}

const searchUserDBASE = (propName, propValue, opPropName=null, sndOpPropName=null) => {
    let returnVar=false;

    user_DATABASE.forEach(user=>{
        if(propValue===user[propName]){
            returnVar={[propName]:user[propName]};
            if(opPropName){
                returnVar[opPropName]=user[opPropName];
            }
            if(sndOpPropName){
                returnVar[sndOpPropName]=user[sndOpPropName];
            }
        }
    });

    return returnVar;
}

const updateUserDBASE = (username, propName, propValue) => {
    let returnVar = false;
    user_DATABASE.forEach(user=>{
        if(username===user.username){
            returnVar = true;
            user[propName] = propValue;
        }
    })

    return returnVar;
}

window.onload = () =>{
    const sections = document.querySelectorAll("body section");
    const selectOrder = document.querySelector(".mainArticle .orderListCon select");
    const sectionCloseBtns = document.querySelectorAll("section .closeBtn");
    const logOutBtn = document.querySelector(".userPanel li .logOutBtn");
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
    const chckBox = document.querySelector(".noteMenu .extraInput .checkEditContainer input");
    const saveLocallyCheck = document.querySelector(".noteMenu .extraInput .saveLocallyContainer input");
    //userSettings
    const userSettings = document.querySelector(".userSettingsBtn");
    const userpfpInput = document.querySelector("#userpfpInput");
    const saveProfileBtn = document.querySelector(".saveProfileBtn");
    const sidePanelInp = document.querySelector("aside.userSidePanel > p:nth-Child(1) > #sidePanelInp");
    const sidePanelBtn = document.querySelector("aside.userSidePanel > p:nth-Child(2) > .sidePanelBtn");
    //otherVar
    let init = true;

    activePanel();
    sections.forEach(section=>{
        closeBtnClicked("."+section.classList[0],false,init);   
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
        }else if(e.target.id === "sidePanelInp"){
            sideInput = e.target.value;
            let printValue;

            if(!sideInput){
                if(sidePanelInp.attributes.data_open.value==="nickName" && userNickName){
                    printValue = "Clear";
                }else if(sidePanelInp.attributes.data_open.value==="mobile" && userMobile){
                    printValue = "Clear";
                }
            }else{
                if(sidePanelInp.attributes.data_open.value==="nickName" && userNickName){
                    printValue = "Edit";
                }else if(sidePanelInp.attributes.data_open.value==="mobile" && userMobile){
                    printValue = "Edit";
                }
            }
            printValue ? sidePanelBtn.textContent = printValue : "";
        }
    }
    
    const checkingBox = e => {
        editable = e.target.checked;
        if(e.target.parentNode.parentNode.parentNode.classList.contains("userEdit")){
            activeNote(true,editable);
        }
    }

    const chkLocallySave = e => {
        saveLocalChk = e.target.checked;
    }

    const focusedTT = e => {
        e.target.parentNode.classList.toggle("focusTT");
    }

    [...sectionCloseBtns, logOutBtn, userSettings, loginMenuBtn, registerMenuBtn, loginregisterFuncBtn, addBtn, delBtn, , sidePanelBtn, saveProfileBtn].forEach(item=>item.addEventListener("click",clicked));
    [usernameInput, emailInput, passwordInput, titleBox, bodyBox, sidePanelInp].forEach(item=>item.addEventListener("input",insertInput));

    window.addEventListener("keydown", e => {
        if(e.target === usernameInput || e.target === emailInput || e.target === passwordInput){
            if(e.key==="Enter"){
                loginregisterFuncBtn.click();
            }
        }
    });

    //loginregister
    usernameInput.addEventListener("focus",focusedTT);
    passwordInput.addEventListener("focus",focusedTT);
    usernameInput.addEventListener("blur",focusedTT);
    passwordInput.addEventListener("blur",focusedTT);
    //note
    chckBox.addEventListener("change", checkingBox);
    saveLocallyCheck.addEventListener("change", chkLocallySave);
    //userSettings
    userpfpInput.addEventListener("change", pfpUpload);

    selectOrder.selectedIndex = 0;

    selectOrder.addEventListener("change",({target})=>{
        orderList(target.value);
    })

    if(!checkLoggedAccount()){
        nodeLoad();
    }
}