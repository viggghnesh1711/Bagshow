document.addEventListener('DOMContentLoaded', function() {
const add=document.querySelectorAll('.addto')
    add.forEach(function(btn){
        btn.addEventListener("click", async function(e){
            const productid = this.getAttribute('data-id'); 
            e.preventDefault();
            try{
                const response = await fetch(`/user/add/${productid}`,{
                    method:'GET'
                });
                const data = await response.json();
                if(data.success){
                    if (data.inCart) {
                        this.classList.remove('addto');
                        this.classList.add('remove');
                        this.innerHTML = '<i class="ri-check-double-line bg-stone-100 border border-stone-900 rounded-full text-stone-900 text-xl p-3 font-normal"></i>';
                      }
                  }
                else{
                    console.log("not done")
                }
            }
            catch(err){
                console.log("eror")
            }
        })
    })


const remove=document.querySelectorAll('.remove')
    remove.forEach(function(btn){
        btn.addEventListener("click", async function(e){
            const productid = this.getAttribute('data-id'); 
            e.preventDefault();
            try{
                const response = await fetch(`/user/remove/${productid}`,{
                    method:'GET'
                });
                const data = await response.json();
                if(data.success){
                    if (!data.inCart) {
                        this.classList.remove('remove');
                        this.classList.add('addto');
                        this.innerHTML = '<i class="ri-shopping-cart-line bg-stone-900 rounded-full text-stone-100 text-xl p-3 font-normal"></i>';
                    console.log("done")
                }
            }
                else{
                    console.log("not done")
                }
            }
            catch(err){
                console.log("eror")
            }
        })
    })
})