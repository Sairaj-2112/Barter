
        // Application State
        let currentUser = 'user123';
        let items = [];
        let userItems = [];
        let offers = [];
        let messages = [];
        let conversations = [];
        let currentOfferTarget = null;
        let currentItemDetails = null;

        // Initialize Application
        document.addEventListener('DOMContentLoaded', function() {
            initializeApp();
            loadSampleData();
            updateStats();
            displayItems();
        });

        function initializeApp() {
            // Add form event listener
            document.getElementById('addItemForm').addEventListener('submit', function(e) {
                e.preventDefault();
                addNewItem();
            });

            document.getElementById('offerForm').addEventListener('submit', function(e) {
                e.preventDefault();
                submitOffer();
            });
        }

        function loadSampleData() {
            // Sample items
            items = [
                {
                    id: 'item1',
                    name: 'MacBook Pro 13"',
                    category: 'Electronics',
                    description: '2019 MacBook Pro, excellent condition, comes with charger and case.',
                    condition: 'Like New',
                    wantedItems: 'Desktop PC or cash equivalent',
                    location: 'San Francisco, CA',
                    owner: 'john_doe',
                    dateAdded: new Date('2024-01-15')
                },
                {
                    id: 'item2',
                    name: 'Programming Books Collection',
                    category: 'Books',
                    description: '15 programming books including Clean Code, Design Patterns, and more.',
                    condition: 'Good',
                    wantedItems: 'Guitar or music equipment',
                    location: 'Austin, TX',
                    owner: 'jane_smith',
                    dateAdded: new Date('2024-01-20')
                },
                {
                    id: 'item3',
                    name: 'Mountain Bike',
                    category: 'Sports',
                    description: 'Trek mountain bike, 21-speed, perfect for trails.',
                    condition: 'Good',
                    wantedItems: 'Electric scooter or skateboard',
                    location: 'Denver, CO',
                    owner: 'mike_rider',
                    dateAdded: new Date('2024-01-25')
                }
            ];

            // Sample user items
            userItems = [
                {
                    id: 'useritem1',
                    name: 'Vintage Guitar',
                    category: 'Other',
                    description: '1980s acoustic guitar, plays beautifully.',
                    condition: 'Good',
                    wantedItems: 'Laptop or tablet',
                    location: 'Los Angeles, CA',
                    owner: currentUser,
                    dateAdded: new Date()
                }
            ];

            // Sample offers
            offers = [
                {
                    id: 'offer1',
                    itemWanted: 'item1',
                    itemOffered: 'useritem1',
                    fromUser: currentUser,
                    toUser: 'john_doe',
                    message: 'Interested in trading my guitar for your MacBook!',
                    status: 'pending',
                    date: new Date()
                }
            ];

            // Sample conversations
            conversations = [
                {
                    id: 'conv1',
                    participants: [currentUser, 'john_doe'],
                    itemDiscussed: 'MacBook Pro 13"',
                    lastMessage: new Date()
                }
            ];

            // Sample messages
            messages = [
                {
                    conversationId: 'conv1',
                    from: currentUser,
                    message: 'Hi, is the MacBook still available?',
                    timestamp: new Date(Date.now() - 3600000)
                },
                {
                    conversationId: 'conv1',
                    from: 'john_doe',
                    message: 'Yes, it is! What do you have to offer?',
                    timestamp: new Date(Date.now() - 1800000)
                }
            ];
        }

        // Tab Navigation
        function showTab(tabName) {
            // Hide all tabs
            document.querySelectorAll('.tab-content').forEach(tab => {
                tab.classList.remove('active');
            });
            
            // Remove active class from all buttons
            document.querySelectorAll('.tab-btn').forEach(btn => {
                btn.classList.remove('active');
            });
            
            // Show selected tab
            document.getElementById(tabName).classList.add('active');
            event.target.classList.add('active');

            // Load specific content
            if (tabName === 'my-items') {
                displayMyItems();
            } else if (tabName === 'offers') {
                displayOffers();
            } else if (tabName === 'messages') {
                loadConversations();
            }
        }

        function showOfferTab(tabName) {
            if (tabName === 'received') {
                document.getElementById('receivedOffers').style.display = 'block';
                document.getElementById('sentOffers').style.display = 'none';
            } else {
                document.getElementById('receivedOffers').style.display = 'none';
                document.getElementById('sentOffers').style.display = 'block';
            }
            
            // Update active button
            document.querySelectorAll('#offers .tab-btn').forEach(btn => {
                btn.classList.remove('active');
            });
            event.target.classList.add('active');
        }

        // Items Management
        function addNewItem() {
            const name = document.getElementById('itemName').value;
            const category = document.getElementById('itemCategory').value;
            const description = document.getElementById('itemDescription').value;
            const condition = document.getElementById('itemCondition').value;
            const wantedItems = document.getElementById('wantedItems').value;
            const location = document.getElementById('itemLocation').value;

            const newItem = {
                id: 'item' + Date.now(),
                name,
                category,
                description,
                condition,
                wantedItems,
                location,
                owner: currentUser,
                dateAdded: new Date()
            };

            items.push(newItem);
            userItems.push(newItem);
            
            // Clear form
            document.getElementById('addItemForm').reset();
            
            showNotification('Item added successfully!');
            updateStats();
            displayItems();
            
            // Switch to browse tab
            showTab('browse');
        }

        function displayItems() {
            const grid = document.getElementById('itemsGrid');
            grid.innerHTML = '';

            const filteredItems = getFilteredItems();

            filteredItems.forEach(item => {
                if (item.owner !== currentUser) {
                    const itemCard = createItemCard(item, false);
                    grid.appendChild(itemCard);
                }
            });

            if (filteredItems.filter(item => item.owner !== currentUser).length === 0) {
                grid.innerHTML = '<p style="text-align: center; color: #718096; font-size: 1.2em;">No items found matching your criteria.</p>';
            }
        }

        function displayMyItems() {
            const grid = document.getElementById('myItemsGrid');
            grid.innerHTML = '';

            userItems.forEach(item => {
                const itemCard = createItemCard(item, true);
                grid.appendChild(itemCard);
            });

            if (userItems.length === 0) {
                grid.innerHTML = '<p style="text-align: center; color: #718096; font-size: 1.2em;">You haven\'t listed any items yet. <a href="#" onclick="showTab(\'add\')">Add your first item!</a></p>';
            }
        }

        function createItemCard(item, isOwner) {
            const card = document.createElement('div');
            card.className = 'item-card';
            
            card.innerHTML = `
                <div class="item-title">${item.name}</div>
                <div class="item-category">${item.category}</div>
                <div class="item-description">${item.description}</div>
                <div class="item-owner">Owner: ${item.owner}</div>
                <div style="margin-bottom: 10px;">
                    <strong>Condition:</strong> ${item.condition}<br>
                    <strong>Location:</strong> ${item.location}<br>
                    <strong>Wants:</strong> ${item.wantedItems}
                </div>
                <div class="item-actions">
                    ${isOwner ? 
                        `<button class="btn btn-secondary" onclick="editItem('${item.id}')">Edit</button>
                         <button class="btn btn-danger" onclick="deleteItem('${item.id}')">Delete</button>` :
                        `<button class="btn" onclick="makeOffer('${item.id}')">Make Offer</button>
                         <button class="btn btn-secondary" onclick="viewItemDetails('${item.id}')">View Details</button>
                         <button class="btn btn-secondary" onclick="contactOwner('${item.owner}', '${item.name}')">Message</button>`
                    }
                </div>
            `;
            
            return card;
        }

        function getFilteredItems() {
            let filtered = [...items];
            
            const searchTerm = document.getElementById('searchInput').value.toLowerCase();
            const categoryFilter = document.getElementById('categoryFilter').value;
            
            if (searchTerm) {
                filtered = filtered.filter(item => 
                    item.name.toLowerCase().includes(searchTerm) ||
                    item.description.toLowerCase().includes(searchTerm)
                );
            }
            
            if (categoryFilter) {
                filtered = filtered.filter(item => item.category === categoryFilter);
            }
            
            return filtered;
        }

        function filterItems() {
            displayItems();
        }

        function sortItems() {
            const sortBy = document.getElementById('sortBy').value;
            
            items.sort((a, b) => {
                switch (sortBy) {
                    case 'newest':
                        return new Date(b.dateAdded) - new Date(a.dateAdded);
                    case 'oldest':
                        return new Date(a.dateAdded) - new Date(b.dateAdded);
                    case 'name':
                        return a.name.localeCompare(b.name);
                    case 'category':
                        return a.category.localeCompare(b.category);
                    default:
                        return 0;
                }
            });
            
            displayItems();
        }

        function deleteItem(itemId) {
            if (confirm('Are you sure you want to delete this item?')) {
                items = items.filter(item => item.id !== itemId);
                userItems = userItems.filter(item => item.id !== itemId);
                showNotification('Item deleted successfully!');
                updateStats();
                displayMyItems();
            }
        }

        function editItem(itemId) {
            const item = userItems.find(item => item.id === itemId);
            if (item) {
                // Populate form with item data
                document.getElementById('itemName').value = item.name;
                document.getElementById('itemCategory').value = item.category;
                document.getElementById('itemDescription').value = item.description;
                document.getElementById('itemCondition').value = item.condition;
                document.getElementById('wantedItems').value = item.wantedItems;
                document.getElementById('itemLocation').value = item.location;
                
                // Delete the old item
                deleteItem(itemId);
                
                // Switch to add tab
                showTab('add');
                showNotification('Item loaded for editing!');
            }
        }

        function viewItemDetails(itemId) {
            const item = items.find(item => item.id === itemId);
            if (item) {
                currentItemDetails = item;
                const modal = document.getElementById('itemModal');
                const details = document.getElementById('itemDetails');
                
                details.innerHTML = `
                    <h3>${item.name}</h3>
                    <div class="item-category">${item.category}</div>
                    <div style="margin: 20px 0;">
                        <strong>Description:</strong><br>
                        ${item.description}
                    </div>
                    <div style="margin: 10px 0;">
                        <strong>Condition:</strong> ${item.condition}<br>
                        <strong>Location:</strong> ${item.location}<br>
                        <strong>Owner:</strong> ${item.owner}<br>
                        <strong>Date Added:</strong> ${item.dateAdded.toLocaleDateString()}
                    </div>
                    <div style="margin: 20px 0;">
                        <strong>Looking for:</strong><br>
                        ${item.wantedItems}
                    </div>
                    <div style="margin-top: 20px;">
                        <button class="btn" onclick="makeOffer('${item.id}')">Make Offer</button>
                        <button class="btn btn-secondary" onclick="contactOwner('${item.owner}', '${item.name}')">Message Owner</button>
                    </div>
                `;
                
                modal.style.display = 'block';
            }
        }

        // Offers Management
        function makeOffer(itemId) {
            currentOfferTarget = itemId;
            
            // Populate user's items in the select
            const select = document.getElementById('offerItemSelect');
            select.innerHTML = '<option value="">Choose an item...</option>';
            
            userItems.forEach(item => {
                const option = document.createElement('option');
                option.value = item.id;
                option.textContent = `${item.name} (${item.category})`;
                select.appendChild(option);
            });
            
            if (userItems.length === 0) {
                select.innerHTML = '<option value="">You need to add items first</option>';
            }
            
            document.getElementById('offerModal').style.display = 'block';
        }

        function submitOffer() {
            const itemOffered = document.getElementById('offerItemSelect').value;
            const message = document.getElementById('offerMessage').value;
            
            if (!itemOffered) {
                alert('Please select an item to offer');
                return;
            }
            
            const targetItem = items.find(item => item.id === currentOfferTarget);
            
            const newOffer = {
                id: 'offer' + Date.now(),
                itemWanted: currentOfferTarget,
                itemOffered: itemOffered,
                fromUser: currentUser,
                toUser: targetItem.owner,
                message: message,
                status: 'pending',
                date: new Date()
            };
            
            offers.push(newOffer);
            
            closeModal('offerModal');
            showNotification('Offer sent successfully!');
            
            // Clear form
            document.getElementById('offerForm').reset();
        }

        function displayOffers() {
            displayReceivedOffers();
            displaySentOffers();
        }

        function displayReceivedOffers() {
            const container = document.getElementById('receivedOffers');
            container.innerHTML = '';
            
            const receivedOffers = offers.filter(offer => offer.toUser === currentUser);
            
            if (receivedOffers.length === 0) {
                container.innerHTML = '<p style="text-align: center; color: #718096;">No offers received yet.</p>';
                return;
            }
            
            receivedOffers.forEach(offer => {
                const offerCard = createOfferCard(offer, true);
                container.appendChild(offerCard);
            });
        }

        function displaySentOffers() {
            const container = document.getElementById('sentOffers');
            container.innerHTML = '';
            
            const sentOffers = offers.filter(offer => offer.fromUser === currentUser);
            
            if (sentOffers.length === 0) {
                container.innerHTML = '<p style="text-align: center; color: #718096;">No offers sent yet.</p>';
                return;
            }
            
            sentOffers.forEach(offer => {
                const offerCard = createOfferCard(offer, false);
                container.appendChild(offerCard);
            });
        }

        function createOfferCard(offer, isReceived) {
            const card = document.createElement('div');
            card.className = 'offer-card';
            
            const wantedItem = items.find(item => item.id === offer.itemWanted);
            const offeredItem = items.concat(userItems).find(item => item.id === offer.itemOffered);
            
            card.innerHTML = `
                <div class="offer-header">
                    <div>
                        <h4>${isReceived ? 'Offer from' : 'Offer to'} ${isReceived ? offer.fromUser : offer.toUser}</h4>
                        <p><strong>Wants:</strong> ${wantedItem?.name}</p>
                        <p><strong>Offers:</strong> ${offeredItem?.name}</p>
                    </div>
                    <div class="offer-status ${offer.status}">${offer.status.toUpperCase()}</div>
                </div>
                <div style="margin-bottom: 15px;">
                    <strong>Message:</strong> ${offer.message || 'No message provided'}
                </div>
                <div style="margin-bottom: 15px;">
                    <small>Date: ${offer.date.toLocaleDateString()}</small>
                </div>
                ${isReceived && offer.status === 'pending' ? 
                    `<div style="display: flex; gap: 10px;">
                        <button class="btn" onclick="acceptOffer('${offer.id}')">Accept</button>
                        <button class="btn btn-danger" onclick="rejectOffer('${offer.id}')">Reject</button>
                        <button class="btn btn-secondary" onclick="contactUser('${offer.fromUser}')">Message</button>
                    </div>` : 
                    `<button class="btn btn-secondary" onclick="contactUser('${isReceived ? offer.fromUser : offer.toUser}')">Message</button>`
                }
            `;
            
            return card;
        }

        function acceptOffer(offerId) {
            const offer = offers.find(o => o.id === offerId);
            if (offer) {
                offer.status = 'accepted';
                showNotification('Offer accepted! The trade is now confirmed.');
                displayOffers();
                updateStats();
            }
        }

        function rejectOffer(offerId) {
            const offer = offers.find(o => o.id === offerId);
            if (offer) {
                offer.status = 'rejected';
                showNotification('Offer rejected.');
                displayOffers();
            }
        }

        // Messaging System
        function contactOwner(ownerId, itemName) {
            contactUser(ownerId, itemName);
        }

        function contactUser(userId, itemName = '') {
            // Find existing conversation
            let conversation = conversations.find(conv => 
                conv.participants.includes(userId) && conv.participants.includes(currentUser)
            );
            
            if (!conversation) {
                // Create new conversation
                conversation = {
                    id: 'conv' + Date.now(),
                    participants: [currentUser, userId],
                    itemDiscussed: itemName,
                    lastMessage: new Date()
                };
                conversations.push(conversation);
            }
            
            // Switch to messages tab
            showTab('messages');
            
            // Load conversation
            document.getElementById('conversationSelect').value = conversation.id;
            loadConversation();
        }

        function loadConversations() {
            const select = document.getElementById('conversationSelect');
            select.innerHTML = '<option value="">Choose a conversation...</option>';
            
            conversations.forEach(conv => {
                const otherUser = conv.participants.find(p => p !== currentUser);
                const option = document.createElement('option');
                option.value = conv.id;
                option.textContent = `${otherUser} - ${conv.itemDiscussed}`;
                select.appendChild(option);
            });
        }

        function loadConversation() {
            const conversationId = document.getElementById('conversationSelect').value;
            const chatContainer = document.getElementById('chatContainer');
            const chatMessages = document.getElementById('chatMessages');
            
            if (!conversationId) {
                chatContainer.style.display = 'none';
                return;
            }
            
            chatContainer.style.display = 'block';
            chatMessages.innerHTML = '';
            
            const conversationMessages = messages.filter(msg => msg.conversationId === conversationId);
            
            conversationMessages.forEach(msg => {
                const messageDiv = document.createElement('div');
                messageDiv.className = `message ${msg.from === currentUser ? 'own' : ''}`;
                messageDiv.innerHTML = `
                    <div><strong>${msg.from}:</strong></div>
                    <div>${msg.message}</div>
                    <div style="font-size: 0.8em; color: #888; margin-top: 5px;">
                        ${msg.timestamp.toLocaleTimeString()}
                    </div>
                `;
                chatMessages.appendChild(messageDiv);
            });
            
            chatMessages.scrollTop = chatMessages.scrollHeight;
        }

        function sendMessage() {
            const conversationId = document.getElementById('conversationSelect').value;
            const messageInput = document.getElementById('messageInput');
            const message = messageInput.value.trim();
            
            if (!conversationId || !message) return;
            
            const newMessage = {
                conversationId: conversationId,
                from: currentUser,
                message: message,
                timestamp: new Date()
            };
            
            messages.push(newMessage);
            messageInput.value = '';
            
            loadConversation();
            showNotification('Message sent!');
        }

        // Profile Management
        function saveProfile() {
            const name = document.getElementById('userName').value;
            const email = document.getElementById('userEmail').value;
            const location = document.getElementById('userLocation').value;
            const bio = document.getElementById('userBio').value;
            
            // In a real app, this would save to a backend
            showNotification('Profile saved successfully!');
        }

        // Utility Functions
        function updateStats() {
            document.getElementById('totalItems').textContent = items.filter(item => item.owner !== currentUser).length;
            document.getElementById('activeUsers').textContent = new Set(items.map(item => item.owner)).size;
            document.getElementById('completedTrades').textContent = offers.filter(offer => offer.status === 'accepted').length;
        }

        function showNotification(message) {
            const notification = document.createElement('div');
            notification.className = 'notification';
            notification.textContent = message;
            document.body.appendChild(notification);
            
            setTimeout(() => {
                notification.remove();
            }, 3000);
        }

        function closeModal(modalId) {
            document.getElementById(modalId).style.display = 'none';
        }

        // Close modals when clicking outside
        window.onclick = function(event) {
            const modals = document.querySelectorAll('.modal');
            modals.forEach(modal => {
                if (event.target === modal) {
                    modal.style.display = 'none';
                }
            });
        }

        // Rating system
        document.querySelectorAll('.star').forEach((star, index) => {
            star.addEventListener('click', function() {
                const stars = this.parentElement.querySelectorAll('.star');
                stars.forEach((s, i) => {
                    if (i <= index) {
                        s.classList.add('active');
                    } else {
                        s.classList.remove('active');
                    }
                });
            });
        });
   