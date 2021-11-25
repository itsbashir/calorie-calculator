// Storage controller
const StorageCtrl = (function () {
  return {
    // Public methods
    storeItem: function(item){
      let items;
      // Check items in local storage
      if (localStorage.getItem('items') === null) {
        items = [];
        // push new item 
        items.push(item);
        // set local storage
        localStorage.setItem('items', JSON.stringify(items));
      } else {
        // Get what's in local storage
        items = JSON.parse(localStorage.getItem('items'));
        
        // Push the new items 
        items.push(item);
        
        // reset local storage
        localStorage.setItem('items', JSON.stringify(items));

      }
    },
    getItemsFromStorage: function(){
      let items;
      if (localStorage.getItem('items') === null) {
        items = [];
      } else {
        items = JSON.parse(localStorage.getItem('items'));
      }
      return items;
    },
    updateItemStorage: function (updatedItem) {
      let items = JSON.parse(localStorage.getItem('items'));

      items.forEach(function (item, index) {
        if (updatedItem.id === item.id) {
          items.splice(index, 1, updatedItem);
        }
      });
      localStorage.setItem('items', JSON.stringify(items));

    },
    deleteItemFromStorage :function(id){
      let items = JSON.parse(localStorage.getItem('items'));

      items.forEach(function (item, index) {
        if (id === item.id) {
          items.splice(index, 1);
        }
      });
      localStorage.setItem('items', JSON.stringify(items));

    }, 
    clearItemsFromStorage: function () {
      localStorage.removeItem('items');
    }
  }
})();





// Item Controller 
const ItemCtrl = (function(){
// Item Constructor
const Item = function (id, name, calories) {
  this.id = id;
  this.name = name;
  this.calories = calories;
}



// Data Structure/State
const data = {
   // items: [
    //   // {id: 0, name: 'Steak Dinner', calories: 1200},
    //   // {id: 1, name: 'Cookie', calories: 400},
    //   // {id: 2, name: 'Eggs', calories: 300}
    // ],
  items: StorageCtrl.getItemsFromStorage(),
  currentItem: null, // when update  icon is clicked on we want that item to saved into the form to be updated
  totalCalories : 0 
}


// Public Methods 
return {
  
  getItems :function () {
    return data.items;
  },
  addItem: function(name, calories){
    // console.log(name, calories);
    let ID;
    // Create id 
    if(data.items.length > 0 ){
      ID = data.items[data.items.length - 1].id + 1; // This for increments for id's in the list 
    } else {
      ID = 0;
    }

    // calories to number 
    calories = parseInt(calories); // this changes text into number


    // Create new Item 
    newItem = new Item(ID, name, calories );

    // Push new item into data / Add to items array 
    data.items.push(newItem);

    return newItem;
  },

  getItemById: function (id) {
    let found = null;
    // loop through items 
    data.items.forEach(function (item) {
      if (item.id === id) {
        found = item;
      }
    });
    return found;
  },

  updateItem : function (name, calories) {
    // calories into number 
    calories = parseInt(calories);
    
    let found = null;
    data.items.forEach(function (item) {
      if (item.id === data.currentItem.id) {
        item.name = name;
        item.calories = calories;
        found = item;
      }
    });
    return found;
  },

  setCurrentItem : function (item) {
    data.currentItem = item;
  },
  getCurrentItem: function () {
    return data.currentItem;
  },

  deleteItem : function (id) {
    // Get ID's
    const ids = data.items.map(function (item) {
      return item.id;
    });

    // Get index 
    const index = ids.indexOf(id);

    // remove item 
    data.items.splice(index, 1);
  },

  clearAllItems : function () {
    data.items = [];
  },


  getTotalCalories: function () {
    let total = 0;
    // Loop through items and add calories 
    data.items.forEach(function (item) {
      total += item.calories;
      // total = total + item.calories;
    });

    // Set data calories in data structure 
    data.totalCalories = total;
    
    // return total 
    return data.totalCalories
  },

  logData : function(){
    return data;
  }
}
})(); // If function which is evoked and will run 


// UI Controller
const UICtrl = (function(){
  const UISelectors = {
    itemList: '#item-list',
    listItems: '#item-list li',
    addBtn: '.add-btn',
    updateBtn: '.update-btn',
    deleteBtn: '.delete-btn',
    backBtn: '.back-btn',
    clearBtn: '.clear-btn',
    itemNameInput : '#item-name',
    itemCaloriesInput : '#calories-name',
    totalCalories : '.total-calories'
  }
  
  // Public Methods 
  return {
    populateItemList: function (items) {
      let html = '';

      items.forEach(function (item) {
        html += `
        
        <li class="collection-item" id="item-${item.id}">
        <strong>${item.name} </strong> 
        <em>${item.calories} Calories</em>
        <a href="#" class="secondary-content">
          <i class="edit-item fa fa-pencil"></i>
        </a>
      </li>`;
      });

      // Insert list items
      document.querySelector(UISelectors.itemList).innerHTML = html;
    },
    addListItem: function (item) {
      // Show the list 
      document.querySelector(UISelectors.itemList).style.display = 'block';
      // Create li element
      const li = document.createElement('li');
      // Add class to li 
      li.className = 'collection-item';
      // Add id to li 
      li.id = `item-${item.id}`;

      // Add html 
      li.innerHTML = `
        <strong>${item.name} </strong> 
          <em>${item.calories} Calories</em>
          <a href="#" class="secondary-content">
          <i class="edit-item fa fa-pencil"></i>
        </a>
      `;

      // Insert item 
      document.querySelector(UISelectors.itemList).insertAdjacentElement('beforeend', li)
    },

    updateListItem : function (item) {
      let listItems = document.querySelectorAll(UISelectors.listItems);
      // Turn node list into array 
      listItems = Array.from(listItems);

      listItems.forEach(function (listItem) {
        const itemID = listItem.getAttribute('id');

        if (itemID === `item-${item.id}`) {
          document.querySelector(`#${itemID}`).innerHTML = `
          <strong>${item.name} </strong> 
            <em>${item.calories} Calories</em>
            <a href="#" class="secondary-content">
            <i class="edit-item fa fa-pencil"></i>
          </a>
        `;
        }
      });
    },
    // delete list item from UI
    deleteListItem: function (id) {
      const itemID = `#item-${id}`;
      const item = document.querySelector(itemID);
      item.remove();
    },

    clearInput: function () {
     
      document.querySelector(UISelectors.itemNameInput).value = '';
      document.querySelector(UISelectors.itemCaloriesInput).value = '';    
    },

    addItemToForm: function () {
      document.querySelector(UISelectors.itemNameInput).value = ItemCtrl.getCurrentItem().name;
      document.querySelector(UISelectors.itemCaloriesInput).value = ItemCtrl.getCurrentItem().calories;  
      UICtrl.showEditState();
     },

    getItemInput: function () {
      return {
        name: document.querySelector(UISelectors.itemNameInput).value,
        calories: document.querySelector(UISelectors.itemCaloriesInput).value
      }
    },
    removeItems: function () {
      let listItems = document.querySelectorAll(UISelectors.listItems);

      // turn node list into array 
      listItems = Array.from(listItems);
      listItems.forEach(function (item) {
        item.remove();
      })
    },

    hideList: function(){
      document.querySelector(UISelectors.itemList).style.display = 'none';
    },

    showTotalCalories: function (totalCalories) {
      document.querySelector(UISelectors.totalCalories).textContent = totalCalories;
    },
    clearEditState: function () {
      UICtrl.clearInput();
      document.querySelector(UISelectors.updateBtn).style.display = 'none';
      document.querySelector(UISelectors.deleteBtn).style.display = 'none';
      document.querySelector(UISelectors.backBtn).style.display = 'none';
      document.querySelector(UISelectors.addBtn).style.display = 'inline';
    },
    showEditState: function () {

      document.querySelector(UISelectors.updateBtn).style.display = 'inline';
      document.querySelector(UISelectors.deleteBtn).style.display = 'inline';
      document.querySelector(UISelectors.backBtn).style.display = 'inline';
      document.querySelector(UISelectors.addBtn).style.display = 'none';
    },
    getSelectors: function () {
      return UISelectors
    }
  }
})(); 



// 
/// App Controller ///

const AppCtrl = (function(ItemCtrl, StorageCtrl, UICtrl){
  // Load event listeners
  const loadEventListeners =  function(){
    // Get UI Selectors 
    const UISelectors = UICtrl.getSelectors();

    // Add item event 
    document.querySelector(UISelectors.addBtn).addEventListener('click', itemAddSubmit);

    // Disable Submit on Enter
    document.addEventListener('keypress', function (e) {
      if(e.keycode === 13 || e.which === 13 )
      e.preventDefault();
      return false;
    })

    // Edit icon click event for editing meals 
    document.querySelector(UISelectors.itemList).addEventListener('click', itemEditClick );
    
    // Update item event
    document.querySelector(UISelectors.updateBtn).addEventListener('click', itemUpdateSubmit );
    
    // Delete item Event
    document.querySelector(UISelectors.deleteBtn).addEventListener('click', itemDeleteSubmit );
    
    // Back button event
    document.querySelector(UISelectors.backBtn).addEventListener('click', UICtrl.clearEditState );
    
    // Clear all items Event
    document.querySelector(UISelectors.clearBtn).addEventListener('click', clearAllItemsClick );
  }

    // Add Items submit 
  const itemAddSubmit = function(e){
    // console.log('Add item');

    // Get form input from UI controller 
    const input = UICtrl.getItemInput();

    // console.log(input);
    // check for name and calories is added 
    if(input.name !=='' && input.calories !== ''){
      // console.log('Something is added to form!');

      // Add Item 
      const newItem = ItemCtrl.addItem(input.name, input.calories);

      // Item to UI List 
      UICtrl.addListItem(newItem);

      // get Total calories 
      const totalCalories = ItemCtrl.getTotalCalories();


      // Add total calories to UI Controller
      UICtrl.showTotalCalories(totalCalories);

      // Store in local storage 
      StorageCtrl.storeItem(newItem);

      // Clear the form /fields
      UICtrl.clearInput();
    }
    e.preventDefault();
  }

   // Click edit item for Update item submitted 
   const itemEditClick = function (e) {

    // target the icon for editing the form 
    if (e.target.classList.contains('edit-item')) {
      // get list item id(item-0,item-1)
      const listID = e.target.parentNode.parentNode.id;
      // break into the array (split item and 0 )
      const listIdArray = listID.split('-');
      // Get the actual id
      const id = parseInt(listIdArray[1]);
      
      // Get Item 
      const itemToEdit = ItemCtrl.getItemById(id);
      
      // set Current Item 
      ItemCtrl.setCurrentItem(itemToEdit);

      // Add item to form 
      UICtrl.addItemToForm();
      // console.log(itemToEdit);
    }
    e.preventDefault();
  }

  // Update item submit
  const itemUpdateSubmit = function (e) {
    
    // Get item input 
    const input = UICtrl.getItemInput();

    // Update item 
    const updatedItem = ItemCtrl.updateItem(input.name, input.calories);
    
    // Update UI
    UICtrl.updateListItem(updatedItem);

    // get Total calories 
    const totalCalories = ItemCtrl.getTotalCalories();
    // Add total calories to UI Controller
    UICtrl.showTotalCalories(totalCalories);

    // Update local storage 
    StorageCtrl.updateItemStorage(updatedItem);

    UICtrl.clearEditState();

    e.preventDefault();
  }

  // Delete button event 
  const itemDeleteSubmit = function (e) {

    // Get it from current item 
    const currentItem = ItemCtrl.getCurrentItem();


    // Delete from data structure 
    ItemCtrl.deleteItem(currentItem.id);

    // Delete from UI
    UICtrl.deleteListItem(currentItem.id);

    // get Total calories 
    const totalCalories = ItemCtrl.getTotalCalories();
    // Add total calories to UI Controller
    UICtrl.showTotalCalories(totalCalories);

    // Delete from local storage
    StorageCtrl.deleteItemFromStorage(currentItem.id);

    UICtrl.clearEditState();

    e.preventDefault();
  }

  // clear items event 

  const clearAllItemsClick = function () {
    // Delete all items from data structure
    ItemCtrl.clearAllItems(); 

    // get Total calories 
    const totalCalories = ItemCtrl.getTotalCalories();
    // Add total calories to UI Controller
    UICtrl.showTotalCalories(totalCalories);


    // Remove from UI
    UICtrl.removeItems();

    // Clear from local storage
    StorageCtrl.clearItemsFromStorage();

    // Hide list 

    UICtrl.hideList();
  }



  // Public Methods 
  return {
    init : function () {
      // console.log('Initializing App....');

      // clear edit state/ set edit state
      UICtrl.clearEditState();
      // Fetch Items from data structure
      const items = ItemCtrl.getItems();

      // Check if any items 
      if (items.length === 0) {
        UICtrl.hideList();
      }else {      
      // Populate list with items 
      UICtrl.populateItemList(items)
      // console.log(items);
      }
      // get Total calories 
      const totalCalories = ItemCtrl.getTotalCalories();

      // Add total calories to UI Controller
      UICtrl.showTotalCalories(totalCalories);


      // Load Event Listener
      loadEventListeners();
    }
  }

})(ItemCtrl, StorageCtrl, UICtrl); 


// Initializing App 
AppCtrl.init(); 