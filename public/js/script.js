
function userowner(){
    const userButton = document.getElementById('userButton');
const ownerButton = document.getElementById('ownerButton');
const btndiv = document.getElementById('btndiv')
const userpage = document.getElementById('userpage')
const ownerpage = document.getElementById('ownerpage')
const pfimage =  document.getElementById('pfimage')
    userButton.addEventListener('click', () => {
        userButton.classList.add('bg-white', 'text-black');
        userButton.classList.remove('bg-black', 'text-white');
        ownerButton.classList.add('bg-black', 'text-white');
        ownerButton.classList.remove('bg-white', 'text-black');
        userpage.classList.remove('hidden')
        userpage.classList.add('flex')
        ownerpage.classList.remove('flex');
        ownerpage.classList.add('hidden');
        pfimage.classList.add('flex')
        pfimage.classList.remove('hidden')
    });
    
    ownerButton.addEventListener('click', () => {
        ownerButton.classList.add('bg-white', 'text-black');
        ownerButton.classList.remove('bg-black', 'text-white');
        userButton.classList.add('bg-black', 'text-white');
        userButton.classList.remove('bg-white', 'text-black');
        ownerpage.classList.remove('hidden');
        ownerpage.classList.add('flex');
        userpage.classList.remove('flex')
        userpage.classList.add('hidden')
        pfimage.classList.add('hidden')
        pfimage.classList.remove('flex')
    });
}

userowner();

