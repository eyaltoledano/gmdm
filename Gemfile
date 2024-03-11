source "https://rubygems.org"
git_source(:github) { |repo| "https://github.com/#{repo}.git" }

ruby "3.2.0"

gem "rails", "~> 7.0.8", ">= 7.0.8.1"
gem "pg", "~> 1.1"
gem "puma", "~> 5.0"
gem "tzinfo-data", platforms: %i[ mingw mswin x64_mingw jruby ]
gem "bootsnap", require: false

# Build JSON APIs with ease [https://github.com/rails/jbuilder]
# gem "jbuilder"
# Use Redis adapter to run Action Cable in production
# gem "redis", "~> 4.0"
# Use Kredis to get higher-level data types in Redis [https://github.com/rails/kredis]
# gem "kredis"

gem "rack-cors"
gem "react-rails"
gem "rails-env"
gem 'jsbundling-rails'
gem 'active_model_serializers'
gem 'dotenv-rails'
gem 'siwe'
gem 'jwt'

group :development do
  gem 'annotate', git: 'https://github.com/ctran/annotate_models.git'
  gem 'rails-erd', group: :development
  gem 'pry-rails', group: :development
end

group :development, :test do
  # See https://guides.rubyonrails.org/debugging_rails_applications.html#debugging-with-the-debug-gem
  gem "debug", platforms: %i[ mri mingw x64_mingw ]
end

group :development do
  # Speed up commands on slow machines / big apps [https://github.com/rails/spring]
  # gem "spring"
end