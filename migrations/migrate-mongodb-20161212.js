/*
  this script migrates lyric field in song schema changing the field name 'lyric' to 'lyrics'
  current state:
  Song = [{
    lyric: [[String]]
    }]

  State after migration:
  Song = [{
      lyrics: [[String]]
  }]

  the solution is:
      1. Update the song.js under folder models to have field lyrics
      2. Store the value in lyric field to lyrics field
      3. Delete the lyric field from the document
      4. Delete the lyric field from song.js under folder models
*/

var mongoose = require('mongoose');
mongoose.Promise = require('bluebird');
var Song = require('../models/song');
var config = require('config');

var MongoURI = process.env.MONGOURI || config.get('mLabDatabaseURI');
mongoose.connect(MongoURI, function(err, database) {
    if (err) {
        console.log('Error connecting to: ' + MongoURI + '. ' + err);
    } else {
        Song.find((err, songs) => {
            var info = {
                success: 0,
                error: 0
            };
            songs.forEach((song, i, arr) => {
                Song.update({
                    _id: song._id
                }, {
                    $set: {
                        lyrics: song.lyric
                    }
                }, (err) => {
                    if (err) {
                        console.log('Error saving lyrics field for ' + song.title);;
                        info.error++
                    } else {
                        Song.update({
                            _id: song._id
                        }, {
                            $unset: {
                                lyric: ''
                            }
                        }, (err) => {
                            if (err) {
                                console.log('error deleting lyric field for ' + song.title);
                                info.error++;
                            } else {
                                console.log('Migrating ' + song.title + ': change the field name lyric to lyrics');
                                info.success++;
                                if (i === arr.length - 1) {
                                    console.log('\nTotal songs: ' + arr.length);
                                    console.log(info.success + ' songs migrated successfully, ' + info.error + ' errors');
                                    console.log('\nClosing DB connection');
                                    mongoose.connection.close();
                                }
                            }
                        });
                    }
                });
            });
        });
    }
});
