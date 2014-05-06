# Require the bundler gem and then call Bundler.require to load in all gems
# listed in Gemfile.
require 'open-uri'
require 'bundler'
require 'date'
Bundler.require

# DataMapper.setup(:default, ENV['HEROKU_POSTGRESQL_VIOLET_URL'])
DataMapper.setup(:default, "postgres://localhost:5432/where")

# Define a simple DataMapper model.
class Map
  include DataMapper::Resource

  property :map_id, Serial, :key => true
  property :map_content, Text  # limit to 65535 chars by default; way less than urls but still potentially a problem for large maps
  property :creation_date, DateTime
  property :update_date, DateTime
end



# Finalize the DataMapper models.
DataMapper.finalize

# Tell DataMapper to update the database according to the definitions above.
DataMapper.auto_upgrade!




get '/' do
  redirect '/map/new'
end

get '/charts/max_deaths' do
  Station.all(:order => [:death_rate.desc]).to_json
end


