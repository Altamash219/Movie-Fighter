const createAutoComplete = ({root, renderOption, onOptionSelect, inputValue, fetchData})=>{
     
root.innerHTML = `
    <label><b>Search</b></label>
    <input class = "input"></input>
    <div class = "dropdown">
        <div class = "dropdown-menu">
            <div class = "dropdown-content results">
            
            </div>    
        </div>
    </div>
        
`

const input = root.querySelector('.input');
const dropdown = root.querySelector('.dropdown');
const resultsWrapper = root.querySelector('.results');

let timeoutId;
const debounce = (func)=>{
    return (...args)=>{
        if(timeoutId){
            clearTimeout(timeoutId);
        }
        timeoutId = setTimeout(()=>{
            func.apply(null, args)
        },500)
    }
}

const onInput = async (event)=>{
     resultsWrapper.innerHTML = '';
     const items = await fetchData(event.target.value)
     dropdown.classList.add('is-active')

     for(let item of items){
        const option = document.createElement('a');
        option.classList.add('dropdown-item')
        option.innerHTML = renderOption(item)
        option.addEventListener('click',(event)=>{
            dropdown.classList.remove('is-active')
            input.value = inputValue(item);
            onOptionSelect(item);
        })
        resultsWrapper.appendChild(option);
    }
} 

input.addEventListener('input',debounce(onInput));
document.addEventListener('click', (event) => {
    if(!root.contains(event.target)){
        dropdown.classList.remove('is-active')
    }
})
}