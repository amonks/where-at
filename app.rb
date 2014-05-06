# Require the bundler gem and then call Bundler.require to load in all gems
# listed in Gemfile.
require 'open-uri'
require 'bundler'
require 'date'
Bundler.require

DataMapper.setup(:default, ENV['HEROKU_POSTGRESQL_TEAL_URL'])
# DataMapper.setup(:default, "postgres://localhost:5432/mapz")

# Define a simple DataMapper model.
class Map
  include DataMapper::Resource

  property :map_id, Serial, :key => true
  property :data, Text  # limit to 65535 chars by default; way less than urls but still potentially a problem for large maps
  property :creation_date, DateTime
  property :update_date, DateTime
end



# Finalize the DataMapper models.
DataMapper.finalize

# Tell DataMapper to update the database according to the definitions above.
DataMapper.auto_upgrade!



get '/' do
  @readme = markdown :readme
  haml :map
end

get '/map/:map_id' do
  @map = Map.get(params[:map_id])
  @data = @map.data
  haml :map
end

post '/' do
  @data = params['data']
  @map = Map.create(:data => @data, :creation_date => Time.now)
  halt 200, @map.map_id.to_s
end

post '/map/:map_id' do
  @map = Map.get(params[:map_id])
  @data = params['data']
  @map.update(:data => @data, :update_date => Time.now)
  halt 200, @map.map_id.to_s
end

