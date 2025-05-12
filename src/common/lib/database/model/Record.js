import {Model} from '@nozbe/watermelondb';
import {field} from '@nozbe/watermelondb/decorators';

export default class Record extends Model {
    static table = 'record';

    @field('business') business;

    @field('action') action;

    @field('type') type;

    @field('content') content;
}
