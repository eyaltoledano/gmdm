Rails.application.routes.draw do
  # root "articles#index"
  namespace :api do
    namespace :v1 do
      resources :users, only: [:index, :create, :show, :update, :destroy]
      resources :nfts, only: [:index, :create, :show, :update, :destroy]
      resources :collections, only: [:index, :create, :show, :update, :destroy], param: :slug
      resources :dms, only: [:index, :create, :show, :update, :destroy]
      resources :messages, only: [:index, :create, :show, :update, :destroy]
    end
  end
end
