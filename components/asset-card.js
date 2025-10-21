class AssetCard extends HTMLElement {
    connectedCallback() {
      this.attachShadow({ mode: 'open' });
      this.render();
    }
  
    static get observedAttributes() {
      return ['asset-id', 'title', 'value', 'location', 'status', 'income', 'depreciation', 'tax-rate', 'image'];
    }
  
    attributeChangedCallback(name, oldValue, newValue) {
      if (oldValue !== newValue) {
        this.render();
      }
    }
  
    render() {
      const assetId = this.getAttribute('asset-id');
      const title = this.getAttribute('title');
      const value = this.getAttribute('value');
      const location = this.getAttribute('location');
      const status = this.getAttribute('status');
      const income = this.getAttribute('income');
      const depreciation = this.getAttribute('depreciation');
      const taxRate = this.getAttribute('tax-rate');
      const image = this.getAttribute('image') || 'http://static.photos/abstract/640x360';
  
      this.shadowRoot.innerHTML = `
        <style>
          .card {
            background: white;
            border-radius: 0.5rem;
            box-shadow: 0 1px 3px rgba(0,0,0,0.1);
            overflow: hidden;
            transition: transform 0.2s ease;
          }
          .card:hover {
            transform: translateY(-2px);
            box-shadow: 0 4px 6px rgba(0,0,0,0.1);
          }
          .card-image {
            height: 160px;
            background-size: cover;
            background-position: center;
          }
          .card-content {
            padding: 1.25rem;
          }
          .card-title {
            font-size: 1.125rem;
            font-weight: 600;
            color: #111827;
            margin-bottom: 0.5rem;
          }
          .card-details {
            display: flex;
            justify-content: space-between;
            margin-bottom: 0.5rem;
          }
          .card-value {
            font-weight: 600;
            color: #111827;
          }
          .card-location {
            color: #6b7280;
            font-size: 0.875rem;
          }
          .card-status {
            display: inline-block;
            padding: 0.25rem 0.5rem;
            border-radius: 9999px;
            font-size: 0.75rem;
            font-weight: 500;
            margin-top: 0.5rem;
          }
          .status-active {
            background-color: #d1fae5;
            color: #065f46;
          }
          .status-sold {
            background-color: #fee2e2;
            color: #b91c1c;
          }
          .card-footer {
            display: flex;
            justify-content: flex-end;
            margin-top: 1rem;
            gap: 0.5rem;
          }
          .card-button {
            padding: 0.375rem 0.75rem;
            border-radius: 0.375rem;
            font-size: 0.875rem;
            font-weight: 500;
            cursor: pointer;
            display: flex;
            align-items: center;
            gap: 0.25rem;
          }
          .edit-btn {
            background-color: #e0e7ff;
            color: #4f46e5;
            border: none;
          }
          .delete-btn {
            background-color: #fee2e2;
            color: #dc2626;
            border: none;
          }
          .icon {
            width: 16px;
            height: 16px;
          }
        </style>
  
        <div class="card">
          <div class="card-image" style="background-image: url('${image}')"></div>
          <div class="card-content">
            <h3 class="card-title">${title}</h3>
            <div class="card-details">
              <span class="card-value">$${value}</span>
              <span class="card-location">${location}</span>
            </div>
            <span class="card-status ${status === 'active' ? 'status-active' : 'status-sold'}">
              ${status === 'active' ? 'Active' : 'Sold'}
            </span>
            <div class="card-footer">
              <button class="card-button edit-btn">
                <svg class="icon" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"></path>
                </svg>
                Edit
              </button>
              <button class="card-button delete-btn">
                <svg class="icon" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path>
                </svg>
                Delete
              </button>
            </div>
          </div>
        </div>
      `;
  
      // Add event listeners
      this.shadowRoot.querySelector('.edit-btn').addEventListener('click', () => {
        const editEvent = new CustomEvent('edit-asset', {
          bubbles: true,
          composed: true,
          detail: {
            id: assetId,
            title: title,
            value: value,
            location: location,
            status: status,
            income: income,
            depreciation: depreciation,
            taxRate: taxRate
          }
        });
        this.dispatchEvent(editEvent);
      });
  
      this.shadowRoot.querySelector('.delete-btn').addEventListener('click', () => {
        const deleteEvent = new CustomEvent('delete-asset', {
          bubbles: true,
          composed: true,
          detail: { id: assetId }
        });
        this.dispatchEvent(deleteEvent);
      });
    }
  }
  
  customElements.define('asset-card', AssetCard);