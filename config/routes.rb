Rails.application.routes.draw do
  root 'index#index'
  get '/signin' => 'signin#index'

  #scope 'admin', :as => 'admin' do
  namespace :admin do
    get '/' => 'admin_signin#index'
    get '/signin' => 'admin_signin#index'
    post '/signin' => 'admin_signin#signin'
    get '/signout' => 'admin_signin#signout'
    get '/welcome' => 'welcome#index'
    get '/menu' => 'admin_modules#index'

    get '/roles/:id/get_modules' => 'admin_roles#get_modules'
    post '/roles/:id/set_modules' => 'admin_roles#set_modules'

    get '/modules/tree' => 'admin_modules#tree'

    concern :search do
      get 'search', on: :collection
    end
    concern :bulk_delete do
      delete 'list', on: :collection
    end
    concern :is_unique do
      get 'list', on: :collection
    end

    resources :users, :controller => 'admin_users', concerns: [:search, :bulk_delete, :is_unique]
    resources :depts, :controller => 'admin_depts', concerns: [:search, :bulk_delete, :is_unique]
    resources :roles, :controller => 'admin_roles', concerns: [:search, :bulk_delete, :is_unique]
  end
  # The priority is based upon order of creation: first created -> highest priority.
  # See how all your routes lay out with "rake routes".

  # You can have the root of your site routed with "root"
  # root 'welcome#index'

  # Example of regular route:
  #   get 'products/:id' => 'catalog#view'

  # Example of named route that can be invoked with purchase_url(id: product.id)
  #   get 'products/:id/purchase' => 'catalog#purchase', as: :purchase

  # Example resource route (maps HTTP verbs to controller actions automatically):
  #   resources :products

  # Example resource route with options:
  #   resources :products do
  #     member do
  #       get 'short'
  #       post 'toggle'
  #     end
  #
  #     collection do
  #       get 'sold'
  #     end
  #   end

  # Example resource route with sub-resources:
  #   resources :products do
  #     resources :comments, :sales
  #     resource :seller
  #   end

  # Example resource route with more complex sub-resources:
  #   resources :products do
  #     resources :comments
  #     resources :sales do
  #       get 'recent', on: :collection
  #     end
  #   end

  # Example resource route with concerns:
  #   concern :toggleable do
  #     post 'toggle'
  #   end
  #   resources :posts, concerns: :toggleable
  #   resources :photos, concerns: :toggleable

  # Example resource route within a namespace:
  #   namespace :admin do
  #     # Directs /admin/products/* to Admin::ProductsController
  #     # (app/controllers/admin/products_controller.rb)
  #     resources :products
  #   end
end
