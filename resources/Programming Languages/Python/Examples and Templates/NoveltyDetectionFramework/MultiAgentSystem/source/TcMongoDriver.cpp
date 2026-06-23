/*# +---------------------------------------------------------+
# |   -=*=-  THIS FILE IS NOT INTENDED FOR SHARING  -=*=-   |
# +---------------------------------------------------------+
# The intellectual and technical concepts are proprietary.
# Dissemination or reproduction is forbidden and may result
# in civil charges and criminal penalties.
*/

#include <mongocxx/client.hpp>
#include <mongocxx/database.hpp>
#include <mongocxx/cursor.hpp>
#include <mongocxx/collection.hpp>
#include <mongocxx/exception/operation_exception.hpp>
#include <mongocxx/exception/query_exception.hpp>
#include <bsoncxx/builder/stream/document.hpp>
#include <bsoncxx/exception/exception.hpp>
#include <bsoncxx/json.hpp>
#include <mongocxx/result/insert_one.hpp>
#include <mongocxx/exception/bulk_write_exception.hpp>
#include "../include/TcMongoDriver.h"
#include "../include/TcColors.h"



using namespace std;


TcMongoDriver::TcMongoDriver(string pMongoDriverName, string pMongoDriverRemoteConnectionType, string pMongoDriverRemoteConnectionHost, uint16_t pMongoDriverRemoteConnectionPort) {
	fprintf(stdout, "(%s) Enter in %s \n", __func__, __func__);
	fflush(stdout);

	this->rmMongoDriverName = pMongoDriverName;
	this->rmMongoDriverRemoteConnectionType = pMongoDriverRemoteConnectionType;
	this->rmMongoDriverRemoteConnectionHost = pMongoDriverRemoteConnectionHost;
	this->rmMongoDriverRemoteConnectionPort = pMongoDriverRemoteConnectionPort;

	fprintf(stdout, "(%s) Exit from %s \n", __func__, __func__);
	fflush(stdout);

}

TcMongoDriver::TcMongoDriver() {

	fprintf(stdout, "(%s) Enter in %s \n", __func__, __func__);
	fflush(stdout);

	this->rmMongoDriverName = string(MONGO_DRIVER_NAME);
	this->rmMongoDriverRemoteConnectionType = string(MONGO_DEFAULT_CONNTYPE);
	this->rmMongoDriverRemoteConnectionHost = string(MONGO_DEFAULT_HOST);
	this->rmMongoDriverRemoteConnectionPort = (uint16_t) MONGO_DEFAULT_PORT;

	fprintf(stdout, "(%s) Exit from %s \n", __func__, __func__);
	fflush(stdout);
}



TcMongoDriver::~TcMongoDriver(){}


int TcMongoDriver::fDatabaseExist(string pDatabase, mongocxx::client& pMongoClient, bool pCreate) {
	
	try {

		fprintf(stdout, "(%s) Enter in %s \n", __func__, __func__);
		fflush(stdout);
		
		bsoncxx::document::view_or_value cDatabaseExistFilter = bsoncxx::builder::stream::document{} << "filter" << bsoncxx::builder::stream::open_document << "name" << pDatabase << bsoncxx::builder::stream::close_document << bsoncxx::builder::stream::finalize;		
		mongocxx::cursor cMongoCursor = pMongoClient.list_databases(cDatabaseExistFilter.view());
		
		if (cMongoCursor.begin() == cMongoCursor.end() && pCreate) {
			try {
				pMongoClient.database(pDatabase);
				fprintf(stdout, "(%s) Exit from %s \n", __func__, __func__);
				fflush(stdout);
				return(TcMongoError::TcMongoDatabase::kCreated);
			}
			catch (mongocxx::operation_exception oe) {
				fprintf(stdout, ANSI_COLOR_RED "(%s) Catched mongocxx::operation_exception - Message %s Value %d Category %s" ANSI_COLOR_RESET "\n", __func__, oe.code().message().c_str(), oe.code().value(), oe.code().category().name());
				fflush(stdout);
				fprintf(stdout, "(%s) Exit from %s \n", __func__, __func__);
				fflush(stdout);
				throw oe;
			}
		} else if (cMongoCursor.begin() == cMongoCursor.end() && !pCreate) {
			fprintf(stdout, "(%s) Exit from %s \n", __func__, __func__);
			fflush(stdout);
			return(TcMongoError::TcMongoDatabase::kDoNotExist);
		} 
		else{
			fprintf(stdout, "(%s) Exit from %s \n", __func__, __func__);
			fflush(stdout);
			return(TcMongoError::TcMongoDatabase::kExist);
		}

	}
	catch (mongocxx::query_exception qe) {
		fprintf(stdout, ANSI_COLOR_RED "(%s) Catched mongocxx::query_exception - Message %s Value %d Category %s" ANSI_COLOR_RESET "\n", __func__, qe.code().message().c_str(), qe.code().value(), qe.code().category().name());
		fflush(stdout);
		fprintf(stdout, "(%s) Exit from %s \n", __func__, __func__);
		fflush(stdout);
		throw qe;
	}
	catch (mongocxx::operation_exception oe) {
		fprintf(stdout, ANSI_COLOR_RED "(%s) Catched mongocxx::operation_exception - Message %s Value %d Category %s" ANSI_COLOR_RESET "\n", __func__, oe.code().message().c_str(), oe.code().value(), oe.code().category().name());
		fflush(stdout);
		fprintf(stdout, "(%s) Exit from %s \n", __func__, __func__);
		fflush(stdout);
		throw oe;
	}


}
int TcMongoDriver::fCollectionExist(string pCollection, mongocxx::database pMongoDatabase, bool pCreate) {
	try {

		fprintf(stdout, "(%s) Enter in %s \n", __func__, __func__);
		fflush(stdout);

		bsoncxx::string::view_or_value cCollectionName = bsoncxx::string::view_or_value(pCollection);

		if (!pMongoDatabase.has_collection(cCollectionName) && pCreate) {
			try {
				pMongoDatabase.create_collection(cCollectionName);
				fprintf(stdout, "(%s) Exit from %s \n", __func__, __func__);
				fflush(stdout);
				return(kCollectionExist_Ok);
			} catch (mongocxx::operation_exception oe) {
				fprintf(stdout, ANSI_COLOR_RED "(%s) Catched mongocxx::operation_exception - Message %s Value %d Category %s" ANSI_COLOR_RESET "\n", __func__, oe.code().message().c_str(), oe.code().value(), oe.code().category().name());
				fflush(stdout);
				fprintf(stdout, "(%s) Exit from %s \n", __func__, __func__);
				fflush(stdout);
				throw oe;
			}
		} else if (!pMongoDatabase.has_collection(cCollectionName) && !pCreate) {
			fprintf(stdout, "(%s) Exit from %s \n", __func__, __func__);
			fflush(stdout);
			return(TcMongoError::TcMongoCollection::kDoNotExist);
		} 
		else {
			fprintf(stdout, "(%s) Exit from %s \n", __func__, __func__);
			fflush(stdout);
			return(TcMongoError::TcMongoCollection::kExist);
		}
	}
	catch (mongocxx::operation_exception oe) {
		fprintf(stdout, ANSI_COLOR_RED "(%s) Catched mongocxx::operation_exception - Message %s Value %d Category %s" ANSI_COLOR_RESET "\n", __func__, oe.code().message().c_str(), oe.code().value(), oe.code().category().name());
		fflush(stdout);
		fprintf(stdout, "(%s) Exit from %s \n", __func__, __func__);
		fflush(stdout);
		throw oe;
	}
}
int TcMongoDriver::fInserDocument(string pDatabase, string pCollection, string pDocument) {
	mongocxx::database cMongoDatabase;
	mongocxx::collection cMongoCollection;
	bsoncxx::document::view_or_value cBsonDocument;
	int rResult = 0;

	fprintf(stdout, "(%s) Enter in %s \n", __func__, __func__);
	fflush(stdout);

	string cMongoDriverRemoteConnectionString = this->rmMongoDriverRemoteConnectionType + "://" + this->rmMongoDriverRemoteConnectionHost + ":" + to_string(this->rmMongoDriverRemoteConnectionPort);
	const mongocxx::uri& cMongoDriverConnectionUri{ bsoncxx::string::view_or_value(cMongoDriverRemoteConnectionString) };

	mongocxx::client cMongoClient = mongocxx::client(cMongoDriverConnectionUri);
	if (!cMongoClient) {
		fprintf(stdout, ANSI_COLOR_RED "(%s) Mongo client invalid" ANSI_COLOR_RESET "\n", __func__);
		fflush(stdout);
		fprintf(stdout, "(%s) Exit from %s \n", __func__, __func__);
		fflush(stdout);
		return(TcMongoError::TcMongoClient::kInvalidClient);
	}


	if ((rResult = fDatabaseExist(pDatabase, cMongoClient)) < 0) {
		fprintf(stdout, ANSI_COLOR_RED "(%s) Database exist fails with error %d" ANSI_COLOR_RESET "\n", __func__, rResult);
		fflush(stdout);
		fprintf(stdout, "(%s) Exit from %s \n", __func__, __func__);
		fflush(stdout);
		fprintf(stdout, "(%s) Exit from %s \n", __func__, __func__);
		fflush(stdout);
		return(rResult);
	}

	cMongoDatabase = cMongoClient[pDatabase];
	if (!cMongoDatabase) {
		fprintf(stdout, ANSI_COLOR_RED "(%s) Mongo database invalid" ANSI_COLOR_RESET "\n", __func__);
		fflush(stdout);
		fprintf(stdout, "(%s) Exit from %s \n", __func__, __func__);
		fflush(stdout);
		return(TcMongoError::TcMongoDatabase::kInvalidDatabase);
	}


	if ((rResult = fCollectionExist(pCollection, cMongoDatabase)) < 0) {
		fprintf(stdout, ANSI_COLOR_RED "(%s) Collection exist fails with error %d" ANSI_COLOR_RESET "\n", __func__, rResult);
		fflush(stdout);
		fprintf(stdout, "(%s) Exit from %s \n", __func__, __func__);
		fflush(stdout);
		return(rResult);
	}
	
	cMongoCollection = cMongoDatabase[pCollection];
	if (!cMongoCollection) {
		fprintf(stdout, ANSI_COLOR_RED "(%s) Mongo collection invalid" ANSI_COLOR_RESET "\n", __func__);
		fflush(stdout);
		fprintf(stdout, "(%s) Exit from %s \n", __func__, __func__);
		fflush(stdout);
		return(TcMongoError::TcMongoCollection::kInvalidCollection);
	}

	
	try {
		cBsonDocument = bsoncxx::from_json(pDocument);
	} catch (bsoncxx::exception e) {
		fprintf(stdout, "(%s) Exit from %s \n", __func__, __func__);
		fflush(stdout);
		throw e;
	}
	
	try {
		auto cResult = cMongoCollection.insert_one(cBsonDocument.view());
		if (!cResult) {
			fprintf(stdout, "(%s) Insertion fails\n", __func__);
			fflush(stdout);
			fprintf(stdout, "(%s) Exit from %s \n", __func__, __func__);
			fflush(stdout);
			return(TcMongoError::TcMongoInsert::kInsertionFails);
		} else {
			fprintf(stdout, "(%s) Insertion success\n", __func__);
			fflush(stdout);
			fprintf(stdout, "(%s) Exit from %s \n", __func__, __func__);
			fflush(stdout);
			return(TcMongoError::TcMongoInsert::kSuccess);
		}
	} catch (mongocxx::bulk_write_exception be) {
		printf(ANSI_COLOR_RED "(%s) Catched mongocxx::bulk_write_exception - Message %s Value %d Category %s" ANSI_COLOR_RESET "\n", __func__, be.code().message().c_str(), be.code().value(), be.code().category().name());
		fflush(stdout);
		fprintf(stdout, "(%s) Exit from %s \n", __func__, __func__);
		fflush(stdout);
		throw be;
	} catch (mongocxx::exception e) {
		fprintf(stdout, ANSI_COLOR_RED "(%s) Catched mongocxx::exception - Message %s Value %d Category %s" ANSI_COLOR_RESET "\n", __func__, e.code().message().c_str(), e.code().value(), e.code().category().name());
		fflush(stdout);
		fprintf(stdout, "(%s) Exit from %s \n", __func__, __func__);
		fflush(stdout);
		throw e;
	}
}
int TcMongoDriver::fInserDocument(string pDatabase, string pCollection, bsoncxx::document::view_or_value pBsonDocument) {

	mongocxx::database cMongoDatabase;
	mongocxx::collection cMongoCollection;
	int rResult = 0;

	fprintf(stdout, "(%s) Enter in %s \n", __func__, __func__);
	fflush(stdout);
	
	string cMongoDriverRemoteConnectionString = this->rmMongoDriverRemoteConnectionType + "://" + this->rmMongoDriverRemoteConnectionHost + ":" + to_string(this->rmMongoDriverRemoteConnectionPort);
	const mongocxx::uri& cMongoDriverConnectionUri{ bsoncxx::string::view_or_value(cMongoDriverRemoteConnectionString) };

	mongocxx::client cMongoClient = mongocxx::client(cMongoDriverConnectionUri);
	if (!cMongoClient) {
		fprintf(stdout, ANSI_COLOR_RED "(%s) Mongo client invalid" ANSI_COLOR_RESET "\n", __func__);
		fflush(stdout);
		fprintf(stdout, "(%s) Exit from %s \n", __func__, __func__);
		fflush(stdout);
		return(TcMongoError::TcMongoClient::kInvalidClient);
	}


	if ((rResult = fDatabaseExist(pDatabase, cMongoClient)) < 0) {
		fprintf(stdout, ANSI_COLOR_RED "(%s) Database exist fails with error %d" ANSI_COLOR_RESET "\n", __func__, rResult);
		fflush(stdout);
		fprintf(stdout, "(%s) Exit from %s \n", __func__, __func__);
		fflush(stdout);
		fprintf(stdout, "(%s) Exit from %s \n", __func__, __func__);
		fflush(stdout);
		return(rResult);
	}

	cMongoDatabase = cMongoClient[pDatabase];
	if (!cMongoDatabase) {
		fprintf(stdout, ANSI_COLOR_RED "(%s) Mongo database invalid" ANSI_COLOR_RESET "\n", __func__);
		fflush(stdout);
		fprintf(stdout, "(%s) Exit from %s \n", __func__, __func__);
		fflush(stdout);
		return(TcMongoError::TcMongoDatabase::kInvalidDatabase);
	}


	if ((rResult = fCollectionExist(pCollection, cMongoDatabase)) < 0) {
		fprintf(stdout, ANSI_COLOR_RED "(%s) Collection exist fails with error %d" ANSI_COLOR_RESET "\n", __func__, rResult);
		fflush(stdout);
		fprintf(stdout, "(%s) Exit from %s \n", __func__, __func__);
		fflush(stdout);
		return(rResult);
	}
	
	cMongoCollection = cMongoDatabase[pCollection];
	if (!cMongoCollection) {
		fprintf(stdout, ANSI_COLOR_RED "(%s) Mongo collection invalid" ANSI_COLOR_RESET "\n", __func__);
		fflush(stdout);
		fprintf(stdout, "(%s) Exit from %s \n", __func__, __func__);
		fflush(stdout);
		return(TcMongoError::TcMongoCollection::kInvalidCollection);
	}


	try {
		auto cResult = cMongoCollection.insert_one(pBsonDocument.view());
		
		if (!cResult) {
			fprintf(stdout, "(%s) Insertion fails\n", __func__);
			fflush(stdout);
			fprintf(stdout, "(%s) Exit from %s \n", __func__, __func__);
			fflush(stdout);
			return(TcMongoError::TcMongoInsert::kInsertionFails);
		} else {
			fprintf(stdout, "(%s) Insertion success\n", __func__);
			fflush(stdout);
			fprintf(stdout, "(%s) Exit from %s \n", __func__, __func__);
			fflush(stdout);
			return(TcMongoError::TcMongoInsert::kSuccess);
		}
	}
	catch (mongocxx::bulk_write_exception be) {
		fprintf(stdout, ANSI_COLOR_RED "(%s) Catched mongocxx::bulk_write_exception - Message %s Value %d Category %s" ANSI_COLOR_RESET "\n", __func__, be.code().message().c_str(), be.code().value(), be.code().category().name());
		fflush(stdout);
		fprintf(stdout, "(%s) Exit from %s \n", __func__, __func__);
		fflush(stdout);
		throw be;
	}
	catch (mongocxx::exception e) {
		fprintf(stdout, ANSI_COLOR_RED "(%s) Catched mongocxx::exception - Message %s Value %d Category %s" ANSI_COLOR_RESET "\n", __func__, e.code().message().c_str(), e.code().value(), e.code().category().name());
		fflush(stdout);
		fprintf(stdout, "(%s) Exit from %s \n", __func__, __func__);
		fflush(stdout);
		throw e;
	}
}
int TcMongoDriver::fInsertDocumentList(string pDatabase, string pCollection, list<string> pDocuments) {
	mongocxx::database cMongoDatabase;
	mongocxx::collection cMongoCollection;
	bsoncxx::document::view_or_value cBsonDocument;
	list<bsoncxx::document::view_or_value> cBsonDocuments;
	int rResult = 0;

	fprintf(stdout, "(%s) Enter in %s \n", __func__, __func__);
	fflush(stdout);


	string cMongoDriverRemoteConnectionString = this->rmMongoDriverRemoteConnectionType + "://" + this->rmMongoDriverRemoteConnectionHost + ":" + to_string(this->rmMongoDriverRemoteConnectionPort);
	const mongocxx::uri& cMongoDriverConnectionUri{ bsoncxx::string::view_or_value(cMongoDriverRemoteConnectionString) };

	mongocxx::client cMongoClient = mongocxx::client(cMongoDriverConnectionUri);
	if (!cMongoClient) {
		fprintf(stdout, ANSI_COLOR_RED "(%s) Mongo client invalid" ANSI_COLOR_RESET "\n", __func__);
		fflush(stdout);
		fprintf(stdout, "(%s) Exit from %s \n", __func__, __func__);
		fflush(stdout);
		return(TcMongoError::TcMongoClient::kInvalidClient);
	}


	if ((rResult = fDatabaseExist(pDatabase, cMongoClient)) < 0) {
		fprintf(stdout, ANSI_COLOR_RED "(%s) Database exist fails with error %d" ANSI_COLOR_RESET "\n", __func__, rResult);
		fflush(stdout);
		fprintf(stdout, "(%s) Exit from %s \n", __func__, __func__);
		fflush(stdout);
		fprintf(stdout, "(%s) Exit from %s \n", __func__, __func__);
		fflush(stdout);
		return(rResult);
	}

	cMongoDatabase = cMongoClient[pDatabase];
	if (!cMongoDatabase) {
		fprintf(stdout, ANSI_COLOR_RED "(%s) Mongo database invalid" ANSI_COLOR_RESET "\n", __func__);
		fflush(stdout);
		fprintf(stdout, "(%s) Exit from %s \n", __func__, __func__);
		fflush(stdout);
		return(TcMongoError::TcMongoDatabase::kInvalidDatabase);
	}


	if ((rResult = fCollectionExist(pCollection, cMongoDatabase)) < 0) {
		fprintf(stdout, ANSI_COLOR_RED "(%s) Collection exist fails with error %d" ANSI_COLOR_RESET "\n", __func__, rResult);
		fflush(stdout);
		fprintf(stdout, "(%s) Exit from %s \n", __func__, __func__);
		fflush(stdout);
		return(rResult);
	}
	
	cMongoCollection = cMongoDatabase[pCollection];
	if (!cMongoCollection) {
		fprintf(stdout, ANSI_COLOR_RED "(%s) Mongo collection invalid" ANSI_COLOR_RESET "\n", __func__);
		fflush(stdout);
		fprintf(stdout, "(%s) Exit from %s \n", __func__, __func__);
		fflush(stdout);
		return(TcMongoError::TcMongoCollection::kInvalidCollection);
	}

	
	for (string cDocument : pDocuments) {
		try {
			cBsonDocument = bsoncxx::from_json(cDocument);
		} catch (bsoncxx::exception e) {
			fprintf(stdout, "(%s) Exit from %s \n", __func__, __func__);
			fflush(stdout);
			fprintf(stdout, "(%s) Exit from %s \n", __func__, __func__);
			fflush(stdout);
			throw e;
		}
		cBsonDocuments.push_back(cBsonDocument);
	}

	try {
		auto cResult = cMongoCollection.insert_many(cBsonDocuments);

		if (!cResult) {
			fprintf(stdout, "(%s) Insertion fails\n", __func__);
			fflush(stdout);
			fprintf(stdout, "(%s) Exit from %s \n", __func__, __func__);
			fflush(stdout);
			return(TcMongoError::TcMongoInsert::kInsertionFails);
		} else {
			fprintf(stdout, "(%s) Insertion success\n", __func__);
			fflush(stdout);
			fprintf(stdout, "(%s) Exit from %s \n", __func__, __func__);
			fflush(stdout);
			return(TcMongoError::TcMongoInsert::kSuccess);
		}
	}
	catch (mongocxx::bulk_write_exception be) {
		fprintf(stdout, ANSI_COLOR_RED "(%s) Catched mongocxx::bulk_write_exception - Message %s Value %d Category %s" ANSI_COLOR_RESET "\n", __func__, be.code().message().c_str(), be.code().value(), be.code().category().name());
		fflush(stdout);
		fprintf(stdout, "(%s) Exit from %s \n", __func__, __func__);
		fflush(stdout);
		throw be;
	}
	catch (mongocxx::exception e) {
		fprintf(stdout, ANSI_COLOR_RED "(%s) Catched mongocxx::exception - Message %s Value %d Category %s" ANSI_COLOR_RESET "\n", __func__, e.code().message().c_str(), e.code().value(), e.code().category().name());
		fflush(stdout);
		fprintf(stdout, "(%s) Exit from %s \n", __func__, __func__);
		fflush(stdout);
		throw e;
	}
}
int TcMongoDriver::fRunQuery(list<string>* pOutputList, string pDatabase, string pCollection, string pFilter, string pProjection, string pSortcriteria, int pSkip, int pLimit, string pGroupcriteria, string pAddfieldscriteria) {
	mongocxx::database cMongoDatabase;
	mongocxx::collection cMongoCollection;
	bsoncxx::document::view_or_value cQueryFilter;
	bsoncxx::document::view_or_value cQueryProjection;
	bsoncxx::document::view_or_value cQuerySortcriteria;
	bsoncxx::document::view_or_value cQueryGroupcriteria;
	bsoncxx::document::view_or_value cQueryAddFields;
	mongocxx::pipeline cQueryPipeline;
	list<string> cOutputList;
	int rResult = 0;

	fprintf(stdout, "(%s) Enter in %s \n", __func__, __func__);
	fflush(stdout);

	string cMongoDriverRemoteConnectionString = this->rmMongoDriverRemoteConnectionType + "://" + this->rmMongoDriverRemoteConnectionHost + ":" + to_string(this->rmMongoDriverRemoteConnectionPort) + "&heartbeat-frequency=3";
	const mongocxx::uri& cMongoDriverConnectionUri{ bsoncxx::string::view_or_value(cMongoDriverRemoteConnectionString) };

	mongocxx::client cMongoClient = mongocxx::client(cMongoDriverConnectionUri);
	if (!cMongoClient) {
		fprintf(stdout, ANSI_COLOR_RED "(%s) Mongo client invalid" ANSI_COLOR_RESET "\n", __func__);
		fflush(stdout);
		fprintf(stdout, "(%s) Exit from %s \n", __func__, __func__);
		fflush(stdout);
		return(TcMongoError::TcMongoClient::kInvalidClient);
	}

	
	if ((rResult = fDatabaseExist(pDatabase, cMongoClient)) < 0) {
		fprintf(stdout, ANSI_COLOR_RED "(%s) Database exist fails with error %d" ANSI_COLOR_RESET "\n", __func__, rResult);
		fflush(stdout);
		fprintf(stdout, "(%s) Exit from %s \n", __func__, __func__);
		fflush(stdout);
		fprintf(stdout, "(%s) Exit from %s \n", __func__, __func__);
		fflush(stdout);
		return(rResult);
	}
	

	cMongoDatabase = cMongoClient[pDatabase];
	if (!cMongoDatabase) {
		fprintf(stdout, ANSI_COLOR_RED "(%s) Mongo database invalid" ANSI_COLOR_RESET "\n", __func__);
		fflush(stdout);
		fprintf(stdout, "(%s) Exit from %s \n", __func__, __func__);
		fflush(stdout);
		return(TcMongoError::TcMongoDatabase::kInvalidDatabase);
	}

	
	if ((rResult = fCollectionExist(pCollection, cMongoDatabase)) < 0) {
		fprintf(stdout, ANSI_COLOR_RED "(%s) Collection exist fails with error %d" ANSI_COLOR_RESET "\n", __func__, rResult);
		fflush(stdout);
		fprintf(stdout, "(%s) Exit from %s \n", __func__, __func__);
		fflush(stdout);
		return(rResult);
	}
	
	cMongoCollection = cMongoDatabase[pCollection];
	if (!cMongoCollection) {
		fprintf(stdout, ANSI_COLOR_RED "(%s) Mongo collection invalid" ANSI_COLOR_RESET "\n", __func__);
		fflush(stdout);
		fprintf(stdout, "(%s) Exit from %s \n", __func__, __func__);
		fflush(stdout);
		return(TcMongoError::TcMongoCollection::kInvalidCollection);
	}


	if (pFilter != "") {
		cQueryFilter = bsoncxx::from_json(pFilter);
		cQueryPipeline.match(cQueryFilter);
	}
	if (pSortcriteria != "") {
		cQuerySortcriteria = bsoncxx::from_json(pSortcriteria);
		cQueryPipeline.sort(cQuerySortcriteria);
	}
	if (pLimit != 0) {
		cQueryPipeline.limit(pLimit);
	}
	if (pSkip != 0) {
		cQueryPipeline.skip(pSkip);
	}
	if (pGroupcriteria != "") {
		cQueryGroupcriteria = bsoncxx::from_json(pGroupcriteria);
		cQueryPipeline.group(cQueryGroupcriteria);
	}
	if (pProjection != "") {
		cQueryProjection = bsoncxx::from_json(pProjection);
		cQueryPipeline.project(cQueryProjection);
	}
	if (pAddfieldscriteria != "") {
		cQueryAddFields = bsoncxx::from_json(pAddfieldscriteria);
		cQueryPipeline.add_fields(cQueryAddFields);
	}

	try {
		mongocxx::options::aggregate cAggregateOptions;
		cAggregateOptions.allow_disk_use(true);
		mongocxx::cursor cMongoCursor = cMongoCollection.aggregate(cQueryPipeline, cAggregateOptions);
		for (bsoncxx::document::view cBsonDocument : cMongoCursor) {
			string cDocument = "";
			try {
				cDocument = bsoncxx::to_json(cBsonDocument);
			}
			catch (bsoncxx::exception be) {
				fprintf(stdout, ANSI_COLOR_RED "(%s) Catched bsoncxx::exception - Message %s Value %d Category %s" ANSI_COLOR_RESET "\n", __func__, be.code().message().c_str(), be.code().value(), be.code().category().name());
				fflush(stdout);
				fprintf(stdout, "(%s) Exit from %s \n", __func__, __func__);
				fflush(stdout);
				throw be;
			}
			cOutputList.push_back(cDocument);
		}

		*pOutputList = cOutputList;
		
		fprintf(stdout, "(%s) Exit from %s \n", __func__, __func__);
		fflush(stdout);
		
		return(TcMongoError::TcMongoQuery::kSuccess);
	}
	catch (mongocxx::query_exception qe) {
		fprintf(stdout, ANSI_COLOR_RED "(%s) Catched mongocxx::query_exception - Message %s Value %d Category %s" ANSI_COLOR_RESET "\n", __func__, qe.code().message().c_str(), qe.code().value(), qe.code().category().name());
		fflush(stdout);
		fprintf(stdout, "(%s) Exit from %s \n", __func__, __func__);
		fflush(stdout);
		throw qe;
	}
	
	
}
int TcMongoDriver::fRunQuery(list<string>* pOutputList, string pDatabase, string pCollection, bsoncxx::document::view_or_value pFilter, bsoncxx::document::view_or_value pProjection, bsoncxx::document::view_or_value pSortcriteria, int pSkip, int pLimit, bsoncxx::document::view_or_value pGroupcriteria){
	mongocxx::database cMongoDatabase;
	mongocxx::collection cMongoCollection;
	mongocxx::pipeline cQueryPipeline;
	list<string> cOutputList;
	int rResult = 0;

	fprintf(stdout, "(%s) Enter in %s \n", __func__, __func__);
	fflush(stdout);

	string cMongoDriverRemoteConnectionString = this->rmMongoDriverRemoteConnectionType + "://" + this->rmMongoDriverRemoteConnectionHost + ":" + to_string(this->rmMongoDriverRemoteConnectionPort);
	const mongocxx::uri& cMongoDriverConnectionUri{ bsoncxx::string::view_or_value(cMongoDriverRemoteConnectionString) };

	mongocxx::client cMongoClient = mongocxx::client(cMongoDriverConnectionUri);
	if (!cMongoClient) {
		fprintf(stdout, ANSI_COLOR_RED "(%s) Mongo client invalid" ANSI_COLOR_RESET "\n", __func__);
		fflush(stdout);
		fprintf(stdout, "(%s) Exit from %s \n", __func__, __func__);
		fflush(stdout);
		return(TcMongoError::TcMongoClient::kInvalidClient);
	}


	if ((rResult = fDatabaseExist(pDatabase, cMongoClient)) < 0) {
		fprintf(stdout, ANSI_COLOR_RED "(%s) Database exist fails with error %d" ANSI_COLOR_RESET "\n", __func__, rResult);
		fflush(stdout);
		fprintf(stdout, "(%s) Exit from %s \n", __func__, __func__);
		fflush(stdout);
		fprintf(stdout, "(%s) Exit from %s \n", __func__, __func__);
		fflush(stdout);
		return(rResult);
	}

	cMongoDatabase = cMongoClient[pDatabase];
	if (!cMongoDatabase) {
		fprintf(stdout, ANSI_COLOR_RED "(%s) Mongo database invalid" ANSI_COLOR_RESET "\n", __func__);
		fflush(stdout);
		fprintf(stdout, "(%s) Exit from %s \n", __func__, __func__);
		fflush(stdout);
		return(TcMongoError::TcMongoDatabase::kInvalidDatabase);
	}


	if ((rResult = fCollectionExist(pCollection, cMongoDatabase)) < 0) {
		fprintf(stdout, ANSI_COLOR_RED "(%s) Collection exist fails with error %d" ANSI_COLOR_RESET "\n", __func__, rResult);
		fflush(stdout);
		fprintf(stdout, "(%s) Exit from %s \n", __func__, __func__);
		fflush(stdout);
		return(rResult);
	}
	
	cMongoCollection = cMongoDatabase[pCollection];
	if (!cMongoCollection) {
		fprintf(stdout, ANSI_COLOR_RED "(%s) Mongo collection invalid" ANSI_COLOR_RESET "\n", __func__);
		fflush(stdout);
		fprintf(stdout, "(%s) Exit from %s \n", __func__, __func__);
		fflush(stdout);
		return(TcMongoError::TcMongoCollection::kInvalidCollection);
	}

	if (pFilter != bsoncxx::document::view_or_value()) {
		cQueryPipeline.match(pFilter);
	}
	if (pSortcriteria != bsoncxx::document::view_or_value()) {
		cQueryPipeline.sort(pSortcriteria);
	}
	if (pLimit != 0) {
		cQueryPipeline.limit(pLimit);
	}
	if (pSkip != 0) {
		cQueryPipeline.skip(pSkip);
	}
	if (pGroupcriteria != bsoncxx::document::view_or_value()) {
		cQueryPipeline.group(pGroupcriteria);
	}
	if (pProjection != bsoncxx::document::view_or_value()) {
		cQueryPipeline.project(pProjection);
	}


	mongocxx::cursor cMongoCursor = cMongoCollection.aggregate(cQueryPipeline, mongocxx::options::aggregate());

	for (bsoncxx::document::view cBsonDocument : cMongoCursor) {
		string cDocument = "";
		try {
			cDocument = bsoncxx::to_json(cBsonDocument);
		}
		catch (bsoncxx::exception e) {
			fprintf(stdout, ANSI_COLOR_RED "(%s) Catched bsoncxx::exception - Message %s Value %d Category %s" ANSI_COLOR_RESET "\n", __func__, e.code().message().c_str(), e.code().value(), e.code().category().name());
			fflush(stdout);
			fprintf(stdout, "(%s) Exit from %s \n", __func__, __func__);
			fflush(stdout);
			throw e;
		}
		cOutputList.push_back(cDocument);
	}

	*pOutputList = cOutputList;
	
	fprintf(stdout, "(%s) Exit from %s \n", __func__, __func__);
	fflush(stdout);

	return(TcMongoError::TcMongoQuery::kSuccess);
}



string TcMongoDriver::fGetMongoDriverConnectionHost(){
	return(this->rmMongoDriverRemoteConnectionHost);
}

string TcMongoDriver::fGetMongoDriverConnectionType(){
	return(this->rmMongoDriverRemoteConnectionType);
}

uint16_t TcMongoDriver::fGetMongoDriverConnectionPort(){
	return(this->rmMongoDriverRemoteConnectionPort);
}




















