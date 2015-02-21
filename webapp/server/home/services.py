import os
from block_io import BlockIo

# Returns next free media space in form of media_obj name - needs converting to absolute path still.
class MediaManager():
    filesys_tracker = {}
    root_path = ''

    def __init__(self, root_path):
        self.root_path = root_path

    def __update_dir(self, directory):
        dir_path = self.__get_path(directory, '')
        if not os.path.isdir(dir_path):
            os.makedirs(dir_path)
        if not directory in self.filesys_tracker.keys():
            self.filesys_tracker[directory] = 0

        while os.path.isfile(self.__get_path(directory, self.filesys_tracker[directory])):
            self.filesys_tracker[directory] += 1

    def __next_in_dir(self, directory):
        space = self.filesys_tracker[directory]
        self.filesys_tracker[directory] += 1
        return space

    def __mkdirp(self, directory):
        if not os.path.isdir(directory):
            os.makedirs(directory)

    def __get_free_space(self, directory):
        self.__update_dir(directory)
        space = self.__next_in_dir(directory)
        return space

    def __get_path(self, directory, space):
        return str(self.root_path) + str(directory) + str(space)

    def reserve_space(self, directory):
        space = self.__get_free_space(directory)
        return self.__get_path(directory, space)


class WalletManager():
    api_version = 2
    api_key = '210f-93e6-cd94-3cd6'
    secret_pin = 'd34g6gjd23df43w'

    def __init__(self):
        self.block_io = BlockIo(self.api_key, self.secret_pin, self.api_version)

    def create_wallet(self):
        response = self.block_io.get_new_address()
        return response['data']['address']

    def get_balance(self, address):
        response = self.block_io.get_address_balance(addresses=address)
        balance = response['data']['available_balance']
        return balance

    def transfer(self, amount, sender, recipient):
        self.block_io.withdraw_from_addresses(amounts=amount, from_addresses=sender, to_addresses=recipient)

